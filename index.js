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
    baseURL: 'http://api.openweathermap.org/data/2.5/forecast'
})


app.get('/forecast', async (req, res) => {
    if(req.method !== 'GET') {
        res.status(405)
        res.send('Method Not Allowed')
        return
    }

    const lat = 45
    const lon = 4
    try{
        request = await axiosHttp.get('', {
            params: {
                lat: lat,
                lon: lon,
                appid: API_KEY
            }
        })
        res.send(request)
    }catch(e){
        switch(e.response.status){
            case 500:
                res.status(500)
                res.send('Internal Server Error')
                break
            case 401:
                res.status(401)
                res.send('Wrong API Key')
                break
        }
    }
})

// Launching servers

httpServer.listen(3000, () => {
    console.log('Listening port 3000...')
})

httpsServer.listen(3001, () => {
    console.log('Listening port 3001...')
})