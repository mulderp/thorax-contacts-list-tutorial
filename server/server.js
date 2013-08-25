var restify = require('restify');
var bunyan = require('bunyan');

var people = [{firstName: 'Patrick', lastName: 'Mulder', number: "555-123123"}]

var server = restify.createServer({
  name: 'peoples',
  version: '1.0.0',
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
    server.on('after', restify.auditLogger({
      log: bunyan.createLogger({ 
        name: 'audit',
        stream: process.stdout,
        level: 'info'
      })
    }));

server.get('/people', function (req, res, next) {
  res.send(people);
  return next();
});

server.post('/people', function (req, res, next) {
  console.log(req.body);
  var person = {firstName: req.body.firstName};
  people.unshift(person);
  res.send(people);
  return next();
});

server.delete('/people/:id', function (req, res, next) {
  console.log(req.body);
  var person = {firstName: req.body.firstName};
  people.unshift(person);
  res.send(people);
  return next();
});

server.get('/people/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
