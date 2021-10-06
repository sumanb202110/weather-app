const express = require('express')
const https = require('https')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const port = 3000

app.get('/:city?', (req, res) => {
    // condition to check the params is provided correctly
    if(req.params.city === undefined){
        return res.send("Please provide city name in url params")
    }

    // Set options for http request
    const options = {
        hostname: `api.openweathermap.org`,
        port: 443,
        path: `/data/2.5/weather?q=${req.params.city}&appid=${process.env.WEATHER_API_KEY}`,
        method: 'GET'
    }

    // request and handle response
    const weatherReq = https.request(options, weatherRes => {
        // console.log(`statusCode: ${weatherRes.statusCode}`)

        weatherRes.on('data', data => {
            // Response in html
            res.send(`<h1>City Name: ${req.params.city}</h1>
                <h2>Temprature: ${JSON.parse(data).main.temp}</h2>
                <h2>Weather: ${JSON.parse(data).weather[0].description}</h2>
                <h2>Humidity: ${JSON.parse(data).main.humidity}</h2>
                `)
        })
    })

    // Detect error
    weatherReq.on('error', error => {
        console.error(error)
    })

    weatherReq.end()

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})