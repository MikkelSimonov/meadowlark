const portfinder = require('portfinder')
const puppeteer = require('puppeteer')

const app = require('../meadowlark.js')

let server = null
let port = null

// ф-ция хелпер - запуск сервера
beforeEach(async () => {
  port = await portfinder.getPortPromise()
  server = app.listen(port)
})

// ф-ция хелпер - закрытие сервера
afterEach(() => {
  server.close()
})

test('домашняя страница ссылается на страницу Описание', async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`)
  await Promise.all([
    page.waitForNavigation(),
    page.click('[data-test-id="about"]'),
  ])
  expect(page.url()).toBe(`http://localhost:${port}/about`) // ожидаем того что УРЛ страницы изменится на необходимый
  await browser.close()
})