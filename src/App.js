import React, { Component } from "react";
import Moment from "moment";
import "moment-timezone";
import tz from "zipcode-to-timezone";
import "./App.css";

class App extends Component {
  state = {};

  getTime = () => {
    const zone = tz.lookup(this.state.zip);
    const now = Moment().tz(zone).format("dddd, MMMM Do YYYY, h:mm:ss a");

    this.setState({
      time: now,
    });
  };

  getWeather = () => {
    const zipInput = document.getElementById("zipInput").value;
    let degUnit = null;

    if (document.getElementById("imperial").checked) {
      degUnit = "imperial";
    } else {
      degUnit = "metric";
    }

    fetch(
      "https://api.openweathermap.org/data/2.5/weather?zip=" +
        zipInput +
        ",us&appid=" +
        process.env.REACT_APP_OW_API_KEY +
        "&units=" +
        degUnit
    )
      .then((response) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        // Examine the text in the response
        response.json().then((data) => {
          this.setState({
            zip: zipInput,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            city: data.name,
            timezone: data.timezone,
          });
          this.getTime();
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  };

  render() {
    return (
      <>
        <div id="form">
          <input type="text" placeholder="Enter ZIP Code" id="zipInput"></input>
          <button onClick={this.getWeather}>Search</button>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-secondary active">
              <input
                type="radio"
                name="options"
                id="imperial"
                checked
                onClick={this.getWeather}
              />
              Imperial
            </label>
            <label className="btn btn-secondary">
              <input
                type="radio"
                name="options"
                id="metric"
                onClick={this.getWeather}
              />
              Metric
            </label>
          </div>
        </div>
        <div>
          <p id="temp">{this.state.temperature}</p>
          <p id="feelsLike">{this.state.feels_like}</p>
          <p id="city">{this.state.city}</p>
          <h3>{this.state.time}</h3>
        </div>
      </>
    );
  }
}

export default App;
