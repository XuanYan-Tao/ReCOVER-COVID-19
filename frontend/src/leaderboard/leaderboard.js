import React, { Component } from "react";
import Papa from "papaparse";
import Leadergraph from "./leadergraph";
import "../covid19app.css";
// import "./leaderboard.css";
import summaryCSV from "./summary/summary_4_weeks_ahead_states.csv";
class Leaderboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            models: [],
            graphInput: []
        };
    }

    componentDidMount = () => {
        Papa.parse(summaryCSV, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        })
    }

    updateData = (result) => {
        const graphInput = []
        const models = result.data.map((csvRow, index) => {
            const model = {id: "", data: []};
            for (const col in csvRow) {
                if (col === "") {
                    model.id = csvRow[col];
                } else if (col.indexOf("mean_sq_abs_error_") >= 0 
                && csvRow[col] != null 
                && csvRow[col] != "") {
                    model.data.push({
                        x: col.substring(18, col.length - 1),
                        y: parseInt(csvRow[col])
                    });
                
                } 
                // Initialize the Y-axis (date) of graph input.
                if (index == 0 
                    && col.indexOf("mean_sq_abs_error_") >= 0) {
                        graphInput.push({name: col.substring(18, col.length - 1)})
                }
            }
            return model;
        });
        const startingDate = new Date(graphInput[0].name.substring(0, 10));
        models.forEach(model => {
            const id = model.id;
            model.data.forEach(datapoint => {
                const date = datapoint.x;
                const val = datapoint.y;
                const index = (new Date(date.substring(0, 10)) - startingDate) / 604800000;
                graphInput[index][id] = val;
            })
        });

        console.log(models);
        console.log(graphInput);
        this.setState((prevState) => ({
            models: models,

        }));
    }

    render() {
        return(
            <div className="graph-container">
                <p>Gello?</p>
            </div>
        );
    }
}

export default Leaderboard;