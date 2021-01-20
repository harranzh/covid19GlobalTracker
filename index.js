if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const covidData = require('./utils/covidData');
const countryCovidHist = require('./utils/countryCovidHist');
const globalCovidData = require('./utils/globalCovidData');
const continentCovidData = require('./utils/continentCovidData');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');

app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

list_of_undefined_countries = ['Falkland Island','Greenland', 'Puerto Rico', 'French Guiana', 'Eswatini', 'Congo', 'Sri Lanka', 'Myanmar', 'North Korea', 'Taiwan', 'Turkmenistan', 'Montenegro', 'Western Sahara', 'South Korea'];
countries_with_highest_covid = ['United States of America', 'India', 'Brazil', 'Russian Federation'];
// const list = []
// var country;

// app.get('/', function(req, res){
//     res.send('Welcome')
// });

app.get('/', function(req, res){

    const USData = [];
    const IndData = [];
    const BrazData = [];
    const RussData = [];

    globalCovidData(async function(error, {total_confirmed, total_recovered, total_deaths, new_confirmed, new_recovered, new_deaths, countries}){
        if (error) {
            return res.send({
                error
            }) 
        } else {
            for (country of countries){
                if (countries_with_highest_covid[0] == country.Country){
                    // console.log(country.Country)
                    var countryName = country.Country;
                    var confirmed = country.TotalConfirmed;
                    var recovered = country.TotalRecovered;
                    var deaths = country.TotalDeaths;
                    USData.push(countryName, confirmed, recovered, deaths)
                }
                if (countries_with_highest_covid[1] == country.Country){
                    var countryName = country.Country;
                    var confirmed = country.TotalConfirmed;
                    var recovered = country.TotalRecovered;
                    var deaths = country.TotalDeaths;
                    IndData.push(countryName, confirmed, recovered, deaths)
                }
                if (countries_with_highest_covid[2]  == country.Country){
                    var countryName = country.Country;
                    var confirmed = country.TotalConfirmed;
                    var recovered = country.TotalRecovered;
                    var deaths = country.TotalDeaths;
                    BrazData.push(countryName, confirmed, recovered, deaths)
                }
                if (countries_with_highest_covid[3] == country.Country){
                    var countryName = country.Country;
                    var confirmed = country.TotalConfirmed;
                    var recovered = country.TotalRecovered;
                    var deaths = country.TotalDeaths;
                    RussData.push(countryName, confirmed, recovered, deaths)
                }
                
            }
            // console.log(USData);
            // console.log(IndData);
            // console.log(BrazData);
            // console.log(RussData);
            return res.render('main.ejs', {
                total_confirmed,
                total_recovered,
                total_deaths,
                new_confirmed,
                new_recovered,
                new_deaths, 
                USData,
                IndData,
                BrazData,
                RussData
            });
        }
    })
});

// Country Route
app.get('/countrycases', function(req, res){
    res.render('view1.ejs');
})

app.get('/cases', function(req, res, next){
    
    const country = req.query.country;
    // console.log(country)

    if (!country) {
        // return res.status(400).json({
        //     status: 'error',
        //     message: 'Missing required field.'
        // });
        throw new BadRequest('Missing required field: country');
        // res.render('error.ejs', message);
    } 
    if (list_of_undefined_countries.includes(country)) {
        const no_data = 'No Data Available';
        return res.render('view1.ejs', {no_data});
    } 
    try {
        covidData(country, function(error, {name, cases_confirmed, recovered, deaths}){
            if (error){
                return res.send({
                    error
                })
            } else {
                if (country == 'Serbia') {
                    name = country
                }
                const total_cases = `The total number of confirmed cases in ${name} is: ${cases_confirmed}, recovered cases: ${recovered} and total deaths: ${deaths}.`;
                return res.render('view1.ejs', {
                    total_cases
                });
            }
        });
    } catch (error) {
        // return res.status(404).json({
        //     status: 'error',
        //     message: 'No data available.'
        // });
        next(error)
    } 
});

app.get('/countryhistory', function(req, res){
    res.render('view2.ejs');
})

app.get('/history', function(req, res, next){
    const country = req.query.country;
    const status = req.query.status;
    const lookup = req.query.thisdate;

    if (!country || !lookup || status == 'choose') {
        // return res.status(400).json({
        //     status: 'error',
        //     message: 'Missing required field: country or date.'
        // });
        throw new BadRequest('Missing required field: country or status or date');
        // res.render('error.ejs', error);
    }
    if (list_of_undefined_countries.includes(country)) {
        const no_history = 'No Data Available';
        return res.render('view2.ejs', {no_history});
    } 
    try {
        countryCovidHist(country, status, function(error, {dates}){
            if (error) {
                return res.send({
                    error
                }); 
            } else {
                for (const[key, entry] of Object.entries(dates)) {
                    if (lookup == `${key}`) {
                        if (status == 'Confirmed') {
                            const message = `The number of confirmed cases in ${country} on ${key} is ${entry}.`;
                            return res.render('view2.ejs', {message});
                        } else if (status == 'Recovered') {
                            const message = `The number of recovered cases in ${country} on ${key} is ${entry}.`;
                            return res.render('view2.ejs', {message});
                        } else {
                            const message = `The total number of deaths in ${country} on ${key} is ${entry}.`;
                            return res.render('view2.ejs', {message});
                        }
                    }
                }            
            }
        });
    } catch (error) {
        // return res.status(404).json({
        //     status: 'error',
        //     message: 'No data available.'
        // });
        next(error)
    }
});

app.use(handleErrors);

app.listen(process.env.PORT || 3000);