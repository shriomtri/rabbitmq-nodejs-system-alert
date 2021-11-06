const express = require('express');
const { MQ, keyes: { alert } } = require('../messaging');
const router = express.Router();

router.get('/critical', (req, res, next) => {
  res.status(200);
  res.end();
  console.log('critical message sending');
  MQ.channel.publish(alert.exchange.exchange, alert.queue_critical.routing_key , Buffer.from(JSON.stringify('Got critical request')));
})


router.get('/limit', (req, res, next) => {
  res.status(200);
  res.end();
  console.log('limit message sending');
  MQ.channel.publish(alert.exchange.exchange, alert.queue_rate_limit.routing_key , Buffer.from(JSON.stringify('Got rate limit request')));
})

module.exports = router;