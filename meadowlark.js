// require
const express = require('express')
const { engine } = require('express-handlebars')
const handlers = require('./lib/handlers')
const bodyParser = require('body-parser') // промежуточное ПО для парсинга тела запроса

const app = express()
const port = process.env.PORT || 3000

// настройка механизма представлений handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main', // указываем макет по умолчанию /views/layouts/main.handlebars
}))

app.disable('x-powered-by')

app.set('view engine', 'handlebars')
app.set('views', './views');

// подключение промежуточного ПО для парсинга тела запроса
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*
  * порядок вызова объявления обработчиков для роутера имеет значение
  * express может различать обработчики ошибок 404 и 500 по кол-ву аргументов, принимаемых их callback ф-циями 
*/

// обработчик роутера для статических ресурсов
app.use(express.static(__dirname + '/public')) // /public - папка со статическими ресурсами: CSS, JPG, JS...

// главная страница - метод get
app.get('/', handlers.home)

// страница о нас - метод get
app.get('/about', handlers.about)

/***** TESTING *****/

app.get('/test-error', (req, res) => {
  res.status(500)
  res.render('error')
})

app.get('/greeting', (req, res) => {
  res.render('greeting', {
    message: 'Приветствую!'
  })
})

// у этого роутера нет макета в папке (views/layouts) поэтому нужно создать только файл views/no-layout.handlebars
app.get('/no-layout', (req, res) => {
  res.render('no-layout', { layout: null })
})

// рендеринг представления с пользовательским макетом
// будет использоватся файл макета views/layouts/custom.handlebars
// а так же файл макета views/custom-layout.handlebars
app.get('/custom-layout', (req, res) => {
  res.render('custom-layout', { layout: 'custom' })
})

// рендеринг неформатированного тектового вывода
app.get('/text', (req, res) => {
  res.type('text/plain')
  res.send('это текст')
})

// роутер для отображения страницы с формой
app.get('/thank-you', (req, res) => res.render('thank-you'))

// роутер для отображения страницы с формой
app.get('/contact-error', (req, res) => res.render('contact-error'))

// роутер для обработки полученного POST запроса
app.post('/process-contact', (req, res) => {
  console.log(`Получен контакт от ${req.body.name} <${req.body.email}>`)
  res.redirect(303, 'thank-you')
})

// роутер для обработки полученного POST запроса - более устойчивый к ошибкам вариант
app.post('/process-contact-2', (req, res) => {

  try {
    if (req.body.simulateError) throw new Error('Ошибка при сохранении контакта!')
    console.log(`Получен контакт от ${req.body.name} <${req.body.email}>`)
    res.format({
      'text/html': () => res.redirect(303, 'thank-you'),
      'application/json': () => res.json({ success: true })
    })
  } catch (err) {
    console.log(`Ошибка при обработке контакта от ${req.body.name} <${req.body.email}>`)
    res.format({
      'text/html': () => res.redirect(303, 'contact-error'),
      'application/json': () => res.status(500).json({
        error: 'ошибка при сохранении информации о контакте'
      })
    })
  }
})

/***** ПРИМЕР АПИ *****/

let tours = [
  { id: 0, name: 'Худ-Ривер', price: 99.99 },
  { id: 1, name: 'Орегон Коуст', price: 149.95 },
]

app.get('/api/tours', (req, res) => {
  
  const toursXml = '<?xml version="1.0"?><tours>' +
    tours.map(p => 
      `<tour price="${p.price}"> id="${p.id}">${p.name}</tour>`
    ).join('') + '</tours>'

  const toursText = tours.map(p => 
      `${p.id}: ${p.name} ${p.price}`
    ).join('\n')

  res.format({
    'application/json': () => res.json(tours),
    'application/xml': () => res.type('application/xml').send(toursXml),
    'text/xml': () => res.type('text/xml').send(toursXml),
    'text/plain': () => res.type('text/plain').send(toursText),
  })
})

/***** ПРИМЕР АПИ PUT, DELETE *****/

app.put('/api/tour/:id', (req, res) => {
  const p = tours.find(p => p.id === parseInt(req.params.id))
  if (!p) return res.status(404).json({ error: 'No such tour exists' })
  if (req.body.name) p.name = req.body.name
  if (req.body.price) p.price = req.body.price
  res.json({ success: true })
})

app.delete('/api/tour/:id', (req, res) => {
  const idx = tours.findIndex(tour => tour.id === parseInt(req.params.id))
  if (idx < 0) return res.json({ error: 'Такого тура не существует' })
  tours.splice(idx, 1)
  res.json({ success: true })
})

// пользовательская страница 404
app.use(handlers.notFound)

// пользовательская страница 500
app.use(handlers.serverError)

// делаем возможность испортировать приложение как модуль
if (require.main === module) { // при запуске файла с помощью node напрямую require.main будет соответствовать глобальному модулю
  app.listen(port, () => {
    console.log(`Express запущен на http://localhost:${port}; Нажмите Ctrl + C для завершения.`)
  })
} else {
  module.exports = app
}