const request = require('request');
const covidData = require('../config');

const continentCovidData = function(continent, callback){
    const url = covidData.fetchByContinent.BASE_URL + encodeURIComponent(continent);
    // console.log(url);

    request({url, json:true}, (error, {body}) => {
        if (error) {
            callback('Cannot fetch Covid-19 data from server.', undefined)
        } else {
            callback(undefined, {
                country: body
            });
        }
    })
}

module.exports = continentCovidData;