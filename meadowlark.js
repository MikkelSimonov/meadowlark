// require
const express = require('express')
const { engine } = require('express-handlebars')

const handlers = require('./lib/handlers')

const app = express()
const port = process.env.PORT || 3000

// настройка механизма представлений handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main', // указываем макет по умолчанию /views/layouts/main.handlebars
}))

app.disable('x-powered-by')

app.set('view engine', 'handlebars')
app.set('views', './views');

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