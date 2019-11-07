
const debug = require('debug')('routes:locate');
const axios = require('axios');
const express = require('express');
const _ = require('lodash');
const handler = require('../middleware/wrapper');

const router = express.Router();
const requiredProperties = ['username', 'password'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', handler(async (req, res) => {
  let ip = req.clientIp;
  const publicIp = require('public-ip');

  if (ip === '::1') ip = await publicIp.v4();
  // const localisation = await axios.get(`https://www.iplocate.io/api/lookup/${ip}`);
  // const localisation = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=6ec1c766d7d3402ea36680595e7bb16f&ip=${ip}`);
  const localisation = await axios.get('https://api.ipdata.co/?api-key=test');
  
  debug(localisation.data);
  return res.status(200).json({
    success: true,
    payload: localisation.data,
  });
}));

module.exports = router;
