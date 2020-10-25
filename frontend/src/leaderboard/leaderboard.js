import React, { Component } from "react";
import Papa from "papaparse";
import Leadergraph from "./leadergraph";
import "../covid19app.css";
// import "./leaderboard.css";
import summaryCSV from "./summary/summary_4_weeks_ahead_states.csv";
class Leaderboard extends Component {

    constructor(props) {
        super(props);
        this.state = {summary: []};
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
        console.log(result.data);
        const modelsSummary = result.data.map(csvRow => {
            const model = {id: "", data: []};
            for (const col in csvRow) {
                if (col === "") {
                    model.id = csvRow[col];
                } else if (col.indexOf("mean_sq_abs_error_") >= 0 
                && csvRow[col] != null 
                && csvRow[col] != "") {
                    model.data.push({
                        "x": col.substring(18, col.length - 1),
                        "y": parseInt(csvRow[col])
                    });
                }
            }
            return model;
        });
        console.log(modelsSummary);
        this.setState({summary: modelsSummary.splice(0, 5)});
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