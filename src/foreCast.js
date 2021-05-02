const request = require('request');

const foreCast = (lat, lng, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=60c7bf24ed83af96bf3105ddc6d4ff28&query=${lat},${lng}`;
    request({url: url, json: true}, (err, {body} = {}) => {
        if (err) {
            callback("unable to connect to the API", undefined);
        } else if (body.current.length === 0) {
            callback("couldnot find the data about your entered location", undefined);
        } else {
            let data = body.current;
            callback(undefined, data);
        }
    });
};

module.exports = foreCast;