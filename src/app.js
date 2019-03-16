const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Weather App',
		name: 'Mislav Matijević'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About me',
		name: 'Mislav Matijević'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		helpMessage: 'Help me please!',
		title: 'Help',
		name: 'Mislav Matijević'
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'You must set an address!'
		});
	}
	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({ error });
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error });
			}
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			});
		});
	});
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term'
		});
	}
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		message: 'Help article not found!',
		title: '404',
		name: 'Mislav Matijević'
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		message: 'Page not found!',
		title: '404',
		name: 'Mislav Matijević'
	});
});

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});
