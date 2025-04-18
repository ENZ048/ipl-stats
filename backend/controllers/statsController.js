const battingData = require('../DataScrappers/data/battingStats.json');
const bowlingData = require('../DataScrappers/data/bowlingStats.json');

const getStatsByType = (data, type, year) => {
    return data[type]?.[year] || [];
}

exports.getBattingDataByType = (req, res) => {
    const {type} = req.params;
    const {year} = req.query;

    const result = getStatsByType(battingData, type, year);

    res.json(result);
}

exports.getBowlingDataByType = (req, res) => {
    const {type} = req.params;
    const {year} = req.query;

    const result = getStatsByType(bowlingData, type, year);

    res.json(result);
}