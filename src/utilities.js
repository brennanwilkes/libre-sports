const axios = require("axios");
const HTMLParser = require("node-html-parser");
const FormData = require("form-data");

const baseURL = "http://cricfree.sc/";

const getAllMatches = (data, regex) => {
	const matches = [];
	let match = regex.exec(data);
	while (match != null) {
		matches.push(match[1]);
		match = regex.exec(data);
	}
	return matches;
}

const getSrc = str => str.replace(/.*src="([^"]+)".*/, (m, $1) => $1);

const getDeepURL = (url, previousURL) => {
	return new Promise((resolve, reject) => {
		axios.get(url).then(resp => {
			const root = HTMLParser.parse(resp.data);
			const iframe = root.querySelector("iframe");
			if(iframe){
				let deeperURL = getSrc(iframe.rawAttrs);
				if(!(new RegExp(/^http/).test(deeperURL))){
					if(deeperURL[0] === "/"){
						deeperURL = `${url.replace(/(https?:\/\/[^.]+\.[^/]+).*/, (m, $1) => $1)}${deeperURL}`;
					}
					else{
						deeperURL = `${url.split('/').slice(0,-1).join('/')}/${deeperURL.replace(/^\//, "")}`;
					}
				}

				if(["worlwidestream.net", "wigistream.to", "www.wmsxx.com"].reduce((cur, next) => cur || deeperURL.includes(next), false)){
					resolve(url);
				}
				else{
					getDeepURL(deeperURL, url).then(resolve).catch(reject);
				}
			}
			else{
				resolve(url);
			}
		}).catch(reject);
	});
}

const getEvents = () =>{
	return new Promise((resolve, reject) => {
		axios.get(baseURL).then(res => {
			resolve(getAllMatches(res.data, /SubmitForm\(('[^']+',[0-9]+)\)/g).map(e => e.replace(/'/g, "").split(",")));
		}).catch(reject);
	});
}

const getEventStream = (event) => {
	return new Promise((resolve, reject) => {
		const form = new FormData();
		form.append("scheduleid", event[1]);
		axios.post(event[0], form, {
			headers: {
				...form.getHeaders()
			}
		}).then(res => {
			Promise.all(getAllMatches(res.data.split("<body>")[1], /(http[^"]+\.live[^"]*)/g).map(getDeepURL)).then(resolve).catch(reject);
		}).catch(reject);
	})
}

const formatEventName = event => event.split("-").filter(word => !new RegExp(/(live|streami?n?g?|cricfree)/, "i").test(word)).map(word => word.length > 3 ? word.charAt(0).toUpperCase() + word.slice(1) : word ).join(" ");

exports.getEventsAndStreams = () => {
	return new Promise((resolve, reject) => {
		getEvents().then(events => {
			Promise.all(events.map((event, i) => {
				return new Promise((resolve2, reject2) => {
					getEventStream(event).then(streams => {
						resolve2({
							name: formatEventName(event[0].split("/").splice(-1)[0]),
							streams
						});
					}).catch(err => {
						resolve2({
							name: formatEventName(event[0].split("/").splice(-1)[0]),
							streams: []
						});
					});
				});
			})).then(resolve).catch(reject);
		}).catch(reject);
	});
}
