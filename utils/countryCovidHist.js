const request = require('request');
const constants = require('../config');

const countryCovidHist = function(country, status, callback) {
    const url = constants.fetchCountryData.BASE_URL + encodeURIComponent(country) + '&status=' + encodeURIComponent(status) ;
    // console.log(url);

    request({url, json:true}, (error, {body}) => {
        // console.log(body.All);
        if (error){
            callback('Cannot fetch Covid-19 data from server.', undefined)
        } else {
            callback(undefined, {dates: body.All.dates})
        }
    })
}

module.exports = countryCovidHist;