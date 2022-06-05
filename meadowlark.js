// require
const express = require('express')
const { engine } = require('express-handlebars')

const fortune = require('./lib/fortune')

const app = express()
const port = process.env.PORT || 3000

// настройка механизма представлений handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main', // указываем макет по умолчанию /views/layouts/main.handlebars
}))

app.set('view engine', 'handlebars')
app.set('views', './views');

/*
  * порядок вызова объявления обработчиков для роутера имеет значение
  * express может различать обработчики ошибок 404 и 500 по кол-ву аргументов, принимаемых их callback ф-циями 
*/

// обработчик роутера для статических ресурсов
app.use(express.static(__dirname + '/public')) // /public - папка со статическими ресурсами: CSS, JPG, JS...

// главная страница - метод get
app.get('/', (req, res) => res.render('home'))

// страница о нас - метод get
app.get('/about', (req, res) => {
  res.render('about', { fortune: fortune.getFortune() })
})

// пользовательская страница 404
app.use((req, res) => {
  res.status(404)
  res.render('404')
})

// пользовательская страница 500
app.use((err, req, res, next) => {
  console.log(err.message)
  res.status(500)
  res.render('500')
})

app.listen(port, () => console.log(`Express запущен на http://localhost:${port}; Нажмите Ctrl + C для завершения.`))