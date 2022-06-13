const fortune = require('./fortune')

// routers
exports.home = (req, res) => res.render('home')
exports.about = (req, res) => res.render('about', { fortune: fortune.getFortune() })
exports.notFound = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => {
  console.log('*** ERROR:' + err)
  res.status(500).render('500', { error: err })
}
exports.newsletterSignup = (req, res) => {
  res.render('newsletter-signup', { csrf: 'Здесь находится токен CSRF' })
}
exports.newsletterSignupProcess = (req, res) => {
  console.log('Форма (из строки запроса): ' + req.query.form)
  console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf)
  console.log('Имя (из видимого поля формы): ' + req.body.name)
  console.log('E-mail (из видимого поля формы): ' + req.body.email)
  res.redirect(303, '/newsletter-signup/thank-you')
}
exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you')
}
exports.newsletter = (req, res) => {
  res.render('newsletter', { csrf: 'Здесь находится токен CSRF' })
}
exports.api = {
  newsletterSignup: (req, res) => {
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf)
    console.log('Имя (из видимого поля формы): ' + req.body.name)
    console.log('E-mail (из видимого поля формы): ' + req.body.email)
    res.send({ result: 'success' })
  }
}