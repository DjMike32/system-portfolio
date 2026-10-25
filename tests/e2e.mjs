/**
 * E2E de suavidad y comportamento con playwright-core y el Chromium cacheado.
 * No descarga navegadores: usa ~/.cache/ms-playwright/chromium-<version>/chrome-linux64/chrome.
 *
 * Comprueba lo que jsdom no puede: CLS real, orden del DOM, foco del flip y
 * frames durante una animación con la CPU ralentizada 4x.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { chromium } from 'playwright-core'

const DIST = resolve('dist')
const PORT = Number(process.env.E2E_PORT || 4175)
const BASE = `http://127.0.0.1:${PORT}`

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

function findChrome() {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME
  const base = join(homedir(), '.cache', 'ms-playwright')
  if (!existsSync(base)) return null
  const dirs = readdirSync(base).filter((d) => d.startsWith('chromium-'))
  for (const d of dirs) {
    const candidates = [
      join(base, d, 'chrome-linux64', 'chrome'),
      join(base, d, 'chrome-linux', 'chrome'),
    ]
    for (const c of candidates) if (existsSync(c)) return c
  }
  return null
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, BASE)
  const path = url.pathname === '/' ? '/index.html' : url.pathname
  const file = join(DIST, decodeURIComponent(path))
  try {
    const data = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404).end('not found')
  }
})

const fails = []
const check = (name, ok, detail = '') => {
  console.log(`${ok ? '  OK  ' : ' FALLA'} ${name}${detail ? ` (${detail})` : ''}`)
  if (!ok) fails.push(name)
}

const chromePath = findChrome()
if (!chromePath) {
  console.error('No se encontró Chromium en ~/.cache/ms-playwright. Define CHROME=/ruta/chrome')
  process.exit(1)
}

await new Promise((r) => server.listen(PORT, '127.0.0.1', r))
const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox', '--disable-gpu'] })

try {
  // ── 1. orden del DOM: Proyectos antes que Stack ──────────────────────────
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(400)

  const orden = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('section[id]')].map((s) => s.id)
    return ids
  })
  check('Proyectos va antes que Stack', orden.indexOf('projects') < orden.indexOf('skills'), orden.join(' > '))

  const nav = await page.$$eval('header nav a', (as) => as.map((a) => a.textContent.trim()))
  // nav[0] es el logotipo; los enlaces empiezan en el índice 1.
  check(
    'nav reordenado',
    nav[1] === 'Perfil' && nav[2] === 'Proyectos' && nav[3] === 'Stack' && nav[4] === 'Trayectoria',
    nav.join(' | '),
  )

  // ── 2. enlaces condicionales ─────────────────────────────────────────────
  const demos = await page.$$eval('a', (as) => as.filter((a) => a.textContent.includes('Demo')).map((a) => a.href))
  check('solo hay demo donde existe', demos.length === 2, demos.join(', '))

  const cv = await page.$$eval('a', (as) => as.filter((a) => /CV/.test(a.textContent)).map((a) => a.getAttribute('href')))
  check('CV enlazado', cv.some((h) => h && h.endsWith('.pdf')), cv.join(', '))

  // ── 3. CLS ───────────────────────────────────────────────────────────────
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(500)
  const cls = await page.evaluate(() => window.__cls)
  // Umbral estricto: «bueno» en Web Vitals es < 0.1; aquí exigimos < 0.05.
  check('CLS < 0.05', cls < 0.05, `cls=${cls.toFixed(4)}`)

  // ── 4. flip: foco al panel y Escape devuelve el foco ─────────────────────
  const btn = page.locator('button', { hasText: 'Ver detalles' }).first()
  await btn.click()
  await page.waitForTimeout(350)
  const focoDentro = await page.evaluate(() => !!document.activeElement?.closest('[role="group"]'))
  check('foco en el panel tras voltear', focoDentro)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  const focoVuelve = await page.evaluate(() =>
    (document.activeElement?.textContent || '').includes('Ver detalles'),
  )
  check('Escape devuelve el foco al botón', focoVuelve)

  // ── 5. frames con CPU 4x más lenta ───────────────────────────────────────
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  const deltas = await page.evaluate(async () => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Ver detalles'))
    const d = []
    let last = performance.now()
    const tick = (t) => {
      d.push(t - last)
      last = t
      if (d.length < 90) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    b.click()
    await new Promise((r) => setTimeout(r, 1000))
    return d
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
  deltas.sort((a, b) => a - b)
  const p95 = deltas[Math.floor(deltas.length * 0.95)] || 0
  const peor = deltas[deltas.length - 1] || 0
  // Con la CPU 4x el presupuesto por frame son ~66 ms (16.7 x 4): exigimos
  // p95 por debajo de ese techo y ningún frame catastrófico.
  check(
    'frames sin tirones con CPU 4x',
    p95 < 70 && peor < 120,
    `p95=${p95.toFixed(1)}ms peor=${peor.toFixed(1)}ms`,
  )

  // ── 6. reduced motion ────────────────────────────────────────────────────
  const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } })
  const p2 = await rm.newPage()
  await p2.goto(BASE, { waitUntil: 'load' })
  await p2.waitForTimeout(600)
  // El CSS apaga las animaciones con duración ínfima, así que pueden seguir
  // registradas: lo que importa es que ninguna dure más de 50 ms.
  // Con reduced motion se permiten fades de opacidad, pero ninguna animación
  // que mueva geometría (transform) debe durar más de 50 ms.
  const conTransform = await p2.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => {
        const d = a.effect?.getTiming?.().duration
        if (typeof d !== 'number' || d <= 50) return false
        const frames = a.effect?.getKeyframes?.() ?? []
        return frames.some((k) => k.transform && k.transform !== 'none')
      })
      .length,
  )
  check('reduced motion no anima geometría', conTransform === 0, `${conTransform} animaciones de transform`)
  await rm.close()

  // ── 7. móvil: la tarjeta es un disclosure accesible ─────────────────────
  const movil = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
  const p3 = await movil.newPage()
  await p3.goto(BASE, { waitUntil: 'load' })
  await p3.waitForTimeout(300)
  await p3.locator('#projects').scrollIntoViewIfNeeded()

  const boton = p3.locator('button', { hasText: 'Ver detalles' }).first()
  const antes = await boton.getAttribute('aria-expanded')
  const panelAntes = await p3.evaluate(() => {
    const p = document.querySelector('[id$="-details"]')
    return { inert: p?.hasAttribute('inert'), hidden: p?.getAttribute('aria-hidden') }
  })
  await boton.click()
  await p3.waitForTimeout(350)
  const despues = await boton.getAttribute('aria-expanded')
  const panelDespues = await p3.evaluate(() => {
    const p = document.querySelector('[id$="-details"]')
    return { inert: p?.hasAttribute('inert'), hidden: p?.getAttribute('aria-hidden') }
  })

  check(
    'móvil: aria-expanded alterna',
    antes === 'false' && despues === 'true',
    `${antes} -> ${despues}`,
  )
  check(
    'móvil: inert/aria-hidden coherentes',
    panelAntes.inert === true && panelAntes.hidden === 'true' && panelDespues.inert === false && panelDespues.hidden === 'false',
    JSON.stringify({ panelAntes, panelDespues }),
  )
  await movil.close()
} finally {
  await browser.close()
  server.close()
}

console.log(`\n${fails.length ? `FALLOS: ${fails.join(', ')}` : 'TODO OK'}`)
process.exit(fails.length ? 1 : 0)
