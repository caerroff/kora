const express = require('express')
const app = express()
const axios = require('axios')

//Handling HTTP
const http = require('http');
const httpServer = http.createServer(app);


//Handling HTTPS
const https = require('node:https');
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
require('dotenv').config()
const API_KEY = process.env.API_KEY
const httpsServer = https.createServer({key: key, cert: cert }, app);

const axiosHttp = axios.create({
    baseURL: 'https://api.openweathermap.org'
})

function kelvinToCelsius(temp){
    return temp - 273.15
}

app.get('/forecast', async (req, res) => {
    
    if(req.method !== 'GET') {
        res.status(405)
        res.send('Method Not Allowed')
        return
    }

    if(req.query.lat === undefined || req.query.lon === undefined){
        res.status(400)
        res.send('Bad Request')
        return
    }

    const lat = req.query.lat
    const lon = req.query.lon

    // Using var instead of let to be able to get the value outside of the try block
    var request;
    try{
        request = await axiosHttp.get('/data/2.5/forecast', {
            params: {
                lat: lat,
                lon: lon,
                appid: API_KEY
            }
        })
    }catch(e){
        res.status(e.response.status)
        res.send(
            {status: e.response.status,
             message: e.response.data.message
            }
        )
    }
    if(!request){
        return
    }
    
    let response = {}
    response.status = request.status
    response.data = {}
    response.data.list = {}
    for(let i = 0; i < request.data.list.length; i++){
        if(!response.data.list[request.data.list[i].dt_txt.substr(0, 10)]){
            response.data.list[request.data.list[i].dt_txt.substr(0, 10)] = []
        }
        response.data.list[request.data.list[i].dt_txt.substr(0, 10)].push(kelvinToCelsius(request.data.list[i].main.temp))
    }
    //calculate average for each day
    response.data.average = {}
    for(let key in response.data.list){
        let sum = 0
        for(let i = 0; i < response.data.list[key].length; i++){
            sum += response.data.list[key][i]
        }
        if(sum === 0){
            continue
        }
        response.data.average[key] = sum / response.data.list[key].length
    }
    res.send(response)
})

// Launching servers

httpServer.listen(3000, () => {
    console.log('Environment: ', process.env.NODE_ENV)
    console.log('Listening port 3000 for HTTP...')
})

httpsServer.listen(3001, () => {
    console.log('Environment: ', process.env.NODE_ENV)
    console.log('Listening port 3001 for HTTPS...')
})