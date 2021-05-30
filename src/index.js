import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			preview: undefined,
			events: []
		}
	}

	componentDidMount(){
		axios.get("/streams").then(data => {
			this.setState({
				events: data.data.events
			});
		}).catch(alert);
	}

	render(){
		return <>
			<div className="container-fluid d-flex align-items-center flex-column justify-content-center p-4">
				{
					this.state.events.length > 0
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
				{
					this.state.events.length === 0
					? <h4>Loading...</h4>
					: <><div>{
						this.state.events.map(event => <>
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
