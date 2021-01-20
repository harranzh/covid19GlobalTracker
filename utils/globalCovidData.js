const request = require('request');
const constant = require('../config');

const globalCovidData = function(callback) {
    const url = constant.globalCovidData.BASE_URL ;

    request({url, json:true}, (error, {body}) => {
        // console.log(body.Global);

        if(error) {
            callback('Cannot fetch Covid-19 data from server.', undefined)
        } else {
            callback(undefined, {
                total_confirmed: body.Global.TotalConfirmed,
                total_recovered: body.Global.TotalRecovered,
                total_deaths: body.Global.TotalDeaths,
                new_confirmed: body.Global.NewConfirmed,
                new_recovered: body.Global.NewRecovered,
                new_deaths: body.Global.NewDeaths,
                countries: body.Countries
            }) 
        }
    })
}

module.exports = globalCovidData;