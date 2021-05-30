
const getEventsAndStreams = require("./utilities.js").getEventsAndStreams;
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/streams", (req, res) => {
	getEventsAndStreams().then(events => {
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
	console.log(`Example app listening at http://localhost:${port}`)
})
