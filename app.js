const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require('dotenv').config({path: __dirname + '/.env'});
const https = require('https');

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }))

const mailchimpAPI = process.env.API_KEY;
const audienceID = process.env.LIST_ID;

app.listen(3000, function() {
    console.log("Listening on port 3000");
})

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.post("/success", function(req, res) {
    res.redirect("/");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const authWithKey = "jan:" + mailchimpAPI;

    const url = 'https://us8.api.mailchimp.com/3.0/lists/' + audienceID;   

    const options = {
        method: "POST",
        auth: authWithKey
    }

    //Using node http.request https://nodejs.org/api/http.html#requestmethod
    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            // console.log(JSON.parse(data));
        })
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {            
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
    request.end();


})

