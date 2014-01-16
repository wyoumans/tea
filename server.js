var express = require('express')
  , path    = require('path')
  , http    = require('http')
  , tea     = require('./routes/teas');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser()),
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/teas', tea.findAll);
app.get('/teas/:id', tea.findById);
app.post('/teas', tea.addTea);
app.put('/teas/:id', tea.updateTea);
app.delete('/teas/:id', tea.deleteTea);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
