    express = require('express');
    var app = express();

    app.get('/my/endpoint', function(req, res){
        res.json({'foo': 'myMockJSON'});
   });

    module.exports = app
