
const util = require("./utilities.js");
const getEvents = util.getEvents;
const streamsFromEvents = util.streamsFromEvents;

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/events", (req, res) => {
	getEvents().then(events => {
		res.status(200).json({
			events: events,
			errors: []
		});
	}).catch(err => {
		res.status(500).send({
			events: [],
			errors: [err]
		});
	});
});

app.get("/streams", (req, res) => {
	const url = req.query.url;
	const id = req.query.id;

	if(!url || !id){
		res.status(400).send({
			events: [],
			errors: [{
				message: "Invalid query params",
				status: 400
			}]
		});
	}
	else{
		streamsFromEvents([
			[
				url,
				id
			]
		]).then(events => {
			res.status(200).json({
				events: events.filter(e => e.streams.length > 0),
				errors: []
			});
		}).catch(err => {
			res.status(500).send({
				events: [],
				errors: [err]
			});
		});
	}
});

app.get("/", (req, res) => {
	res.sendFile("public/index.html", {
		root: `${__dirname}/../`
	});
});

app.get("/bundle.js", (req, res) => {
	res.sendFile("dist/bundle.js", {
		root: `${__dirname}/../`
	});
});


app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
})
