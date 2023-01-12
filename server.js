const express = require('express');
const promMid = require('express-prometheus-middleware');
const app = express();
const cors = require('cors');

app.set("port", process.env.PORT || 4000);

app.use(cors());

app.use(function(req, res, next) {
   if (!req.headers.authorization || req.headers.authorization != 'mysecrettoken') {
      return res.status(403).send({ message: 'Please make sure your request has correct Authorization header' });
   }
   next();
 });


app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  authenticate: req => req.headers.authorization == 'mysecrettoken',
}));


app.get('/time', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { 
      "properties": { 
      "epoch": { 
      "description": "The current server time, in epoch seconds, at time of processing the request.", 
      "type": "number" 
      } 
      }, 
      "required": ["epoch"], 
      "type": "object" 
      }
   res.end(JSON.stringify(response));
})


var server = app.listen(app.get("port"), function () {
  var port = server.address().port
  console.log("Node.js API app listening at port %s", port)
})
