const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const geoCode = require("./src/geoCode.js");
const foreCast = require("./src/foreCast.js");

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

//setup the paths
const viewsPath = path.join(__dirname, "/templates/views");
const partialsPath = path.join(__dirname + "/templates/partials");

//app.set contents
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
    res.render("index", {
        page_title: "weather App",
        title: "weather app",
        name: "Raktim Thapa"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        page_title: "help",
        title: "Help Page",
        help: "this is the help page of our weather api. This gives all the information you need to know about the weathers"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        page_title: "about",
        title: "About Me"
    });
});

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.render("error", {
            err_message: "you must fill the form to view the weather info",
        });
    };
    geoCode(req.query.address, (err, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (err) {
            return res.render("error", {
                err_message: err,
            });
        }
        foreCast(latitude, longitude, (err, forCastedData) => {
            if (err) {
                return res.send({
                    error: err,
                })
            };
            res.render("weather", {
                page_title: "weather",
                title: "Weather Page",
                location: location,
                forecast: `current temprature is ${forCastedData.temperature} and feels like ${forCastedData.feelslike}`,
                address: req.query.address,
                rainPossiblity: forCastedData.weather_descriptions[0],
                cloudy: forCastedData.cloudcover,
                uv_index: forCastedData.uv_index,
                visibility: forCastedData.visibility,
                humidity: forCastedData.humidity,
            })
        })
    });
});

app.get("/help/*", (req, res) => {
    res.render("error", {
        page_title: "error",
        err_message: "help page is not found",
    });
});

app.get("/api", (req, res) => {
    res.send({
        forecast: "it is 35 and feels like 35",
        location: "Butwal, Lumbini, Nepal",
        addres: "Butwal"
    });
});

app.get("*", (req, res) => {
    res.render("error", {
        page_title: "error",
        err_message: "404 error the page is not found",
    });
});

app.listen(port, (req, res) => {
    console.log("conntected to the port " + port);
});