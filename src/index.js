import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import FloatingLabel from "react-bootstrap-floating-label";


class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			preview: undefined,
			events: [],
			eventsFiltered: [],
			queryText: ""
		}
	}

	componentDidMount(){
		axios.get("/events").then(data => {
			this.setState({
				events: data.data.events,
				eventsFiltered: data.data.events
			});
		}).catch(alert);
	}

	componentDidUpdate(prevProps, prevState){
		if(prevState.eventsFiltered !== this.state.eventsFiltered){
			this.state.eventsFiltered.filter(e => e[0].toLowerCase().includes(this.state.queryText.toLowerCase())).forEach((event, i) => {
				axios.get(`/streams?url=${encodeURIComponent(event[0])}&id=${encodeURIComponent(event[1])}`).then(data => {
					const obj = {};
					obj[data.data.events[0].name] = data.data.events[0];
					this.setState(obj);
				}).catch(console.error);
			});
		}
	}

	render(){

		let streams = Object.keys(this.state).filter(key => key !== "events" && key !== "preview" && key !== "eventsFiltered" && key !== "queryText").map(key => this.state[key]);
		streams = streams.filter(stream => stream.name.toLowerCase().includes(this.state.queryText.toLowerCase()));

		return <>
			<div className="container-fluid d-flex align-items-center flex-column justify-content-center p-4">
				{
					streams.length > 0
					? <>
						<div className="my-3 d-flex align-items-center justify-content-center" style={{
							width: "50vw",
							height: "40vh"
						}}>{
							this.state.preview
							? <iframe width="100%" height="100%" src={this.state.preview}></iframe>
							: <h4>Scroll over a link to preview</h4>
						}</div>
					</>
					: <></>
				}
				<h1 className="font-weight-bold">Events</h1>
				<FloatingLabel
					label="Filter"
					style={{
						width: "50vw"
					}}
					id="filter"
					onChange={event => {
						this.setState({
							eventsFiltered: this.state.events.filter(e => e[0].toLowerCase().includes(event.target.value.toLowerCase())),
							queryText: event.target.value
						});
					}}
					onChangeDelay={200}
				/>{
					streams.length === 0
					? <h4>Loading...</h4>
					: <>
					<div>{
						streams.map(event => <>
							<div className="my-3 col-12 d-flex flex-column align-items-center justify-content-center">
								<h3>{event.name}</h3>
								<div className="d-flex align-items-center justify-content-center">{
								event.streams.map((stream, i) => <>
									<a onMouseEnter={() => this.setState({preview: stream})} className="h4 m-2" href={stream}>Stream {i + 1}</a>
								</>)
								}</div>
							</div>
						</>)
					}</div></>
				}
			</div>
		</>;
	}
}

// Main render
ReactDOM.render(<App />, document.getElementsByTagName("MAIN")[0]);
