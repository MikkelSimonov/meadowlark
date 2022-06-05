// импортируем код который нужно протестировать
const handlers = require('../handlers')

// создание теста
test('home page renders', () => {

  // создание переменных которые имитируют аргументы тестируемой ф-ции
  const req = {}
  const res = { render: jest.fn() } // jest.fn() - обобщенная ф-ция заглушка, которая отслеживает то, как вызывается рендер

  // вызов ф-ции которую мы тестируем
  handlers.home(req, res)

  /*
    ожидаемый результат
    [0][0] - первый индекс указывает на номер вызова, а второй на номер аргумента
  */
  expect(res.render.mock.calls[0][0]).toBe('home')
})

test('страница О нас отображается с предсказанием', () => {
  const req = {}
  const res = { render: jest.fn() }

  handlers.about(req, res)

  expect(res.render.mock.calls.length).toBe(1) // кол-во вызовов равно одному
  expect(res.render.mock.calls[0][0]).toBe('about') // первый агрумент равен строке 'about'

  /*
    ожидание того что ф-ции будет передано предсказание в виде строки,
    содержащей как минимум один символ
  */
  expect(res.render.mock.calls[0][1]).toEqual(expect.objectContaining({
    fortune: expect.stringMatching(/\W/)
  }))
})


test('рендеринг обработчика ошибки 404', () => {
  const req = {}
  const res = { render: jest.fn() }

  handlers.notFound(req, res)

  expect(res.render.mock.calls.length).toBe(1) // кол-во вызовов равно одному
  expect(res.render.mock.calls[0][0]).toBe('404') // первый агрумент равен строке '404'
})

test('рендеринг обработчика ошибки 500', () => {
  const err = new Error('some error')
  const req = {}
  const res = { render: jest.fn() }
  const next = jest.fn()

  handlers.serverError(err, req, res, next)

  expect(res.render.mock.calls.length).toBe(1) // кол-во вызовов равно одному
  expect(res.render.mock.calls[0][0]).toBe('500') // первый агрумент равен строке '500'
})