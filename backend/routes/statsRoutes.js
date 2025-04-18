const express = require('express');
const router = express.Router();

const {getBattingDataByType, getBowlingDataByType} = require('../controllers/statsController');

router.get("/batting/:type", getBattingDataByType);
router.get("/bowling/:type", getBowlingDataByType);

module.exports = router;