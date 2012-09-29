var express = require('express'),
    hype = require('./glue/hype').hype,
    app = express();

app.configure(function(){
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))
  app.set('view options', { layout: false })
})

app.get("/", function (req, res) {
  res.render('index', {title: "main"})
})

app.get("/application/json/:id", function (req, res) {
  var appId = req.params.id
  hype.getApp(appId).pipe(res);
})

app.get("/application/:id", function (req, res) {
  var appId = req.params.id
  res.render('application', {title: "application", appId: req.params.id})
})

app.listen(3000)
console.log('Maybe listening on port 3000, I dunno, whatever...')
