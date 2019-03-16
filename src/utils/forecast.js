const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const url = `https://api.darksky.net/forecast/3a5d9373b8498aa44e8f16730c7e8165/${latitude},${longitude}?units=si`;
	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service!');
		} else if (body.error) {
			callback('Unable to find location!');
		} else {
			callback(undefined, {
				summary: body.daily.data[0].summary,
				temperature: body.currently.temperature,
				rainProb: body.currently.precipProbability
			});
		}
	});
};

module.exports = forecast;
