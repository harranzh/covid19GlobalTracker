const request = require('request');
const constants = require('../config');

const covidData = function(country, callback) {
    const url = constants.openCovidApp.BASE_URL + encodeURIComponent(country);
    // console.log(url);
    // object deconstruction
    request({url, json:true}, (error, {body}) => {
        // console.log(body.All);
        if (error) {
            callback('Cannot fetch Covid-19 data from server.', undefined)
        } else {
            callback(undefined, {
                name: body.All.country,
                cases_confirmed: body.All.confirmed,
                recovered: body.All.recovered,
                deaths: body.All.deaths,
            })
        }
    })
}

module.exports = covidData;
