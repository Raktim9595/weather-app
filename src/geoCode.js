const request = require('request');

const geoCode = (address, callback) => {
    const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoicmFrdGltIiwiYSI6ImNrbzVob2tyaDByMmkydnF3OWZxNDExMHAifQ.k2_GVwKWCkJUIVw1olcrnA&limit=1`;
    request({url: geoUrl, json: true}, (err, res) => {
        if(err) {
            callback("unable to connect to the API", undefined);
        }
         else if (res.body.features.length === 0) {
            callback("unable to find the entered location", undefined);
        } else {
            callback(undefined, {
                latitude: res.body.features[0].center[1],
                longitude: res.body.features[0].center[0],
                location: res.body.features[0].place_name,
            });
        }
    });
};

module.exports = geoCode;