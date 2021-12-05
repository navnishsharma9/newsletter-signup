const express = require("express");
const request = require("request");
const https = require("https");
const path = require("path");
require("dotenv").config();
const {MAILCHIMP_AUTH, MAILCHIMP_URI} = process.env;

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", (req, res) => {
    res.sendFile(__dirname + "/failure.html");
});
app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    

    const jsonData = JSON.stringify(data);

    const url = MAILCHIMP_URI;
    const option = {
        method: "POST",
        auth: MAILCHIMP_AUTH
    };


    const request = https.request(url, option, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            JSON.parse(data);
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res)=>{
    res.redirect("/");
});

app.post("/success", (req, res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

// 2a40284eaf5c61ddfa5c1594fa3a217a-us6
// 4f0fa8ca95