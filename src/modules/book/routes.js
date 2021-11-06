const express = require('express');
const router = express.Router();

router.get('/success', (req, res, next) => {
  res.status(200).res.send({...res.query});
})


router.get('/error', (req, res, next) => {
  next({status: 500, type: 'critical'})
})

module.exports = router;