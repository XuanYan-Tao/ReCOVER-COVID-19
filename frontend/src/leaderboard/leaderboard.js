import React, { Component } from "react";
import Papa from "papaparse";
import Leadergraph from "./leadergraph";
import "../covid19app.css";
import "./leaderboard.css";
import summaryCSV from "./summary/summary_4_weeks_ahead_states.csv";

import {
    Form,
    Select,
    Row,
    Col,
    Radio
  } from "antd";

  const { Option } = Select;

//import percentCSV from "./summary/summary_4_weeks_ahead_us.csv";
class Leaderboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            models: this.props.models || [],
            modelList: [],
            rmseSummary: [],
            maeSummary: [],
            mainGraphData: {},
            errorType: "rmse"
           // percentSummary: []
        };
    }

    componentDidMount = () => {
        this.formRef = React.createRef();
        Papa.parse(summaryCSV, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        });
        // Papa.parse(percentCSV, {
        //     header: true,
        //     download: true,
        //     skipEmptyLines: true,
        //     complete: this.parsePercentData
        // })
    }

    updateData = (result) => {
        const rmseSummary = result.data.map((csvRow, index) => {
            const model = {id: "", data: []};
            for (const col in csvRow) {
                if (col === "") {
                    model.id = csvRow[col];
                    this.setState(state => {
                        const modelList = state.modelList.concat(csvRow[col]);
                        return {
                            modelList,
                        };
                    });
                } else if (col.indexOf("mean_sq_abs_error_") >= 0) {
                    model.data.push({
                        x: col.substring(18, col.length),
                        y: parseInt(csvRow[col])
                    });
                } 
            }
            return model;
        });

        const maeSummary = result.data.map((csvRow, index) => {
            const model = {id: "", data: []};
            for (const col in csvRow) {
                if (col === "") {
                    model.id = csvRow[col];
                } else if (col.indexOf("mean_abs_error_") >= 0) {
                    model.data.push({
                        x: col.substring(15, col.length),
                        y: parseInt(csvRow[col])
                    });
                } 
            }
            return model;
        });

        this.setState({
            rmseSummary: rmseSummary,
            maeSummary: maeSummary,
        }, ()=>{
            this.addModel('USC-SI_kJalpha');
        });
    }

    modelIsSelected = (model)=>{
        if (this.state.models && model) {
          return this.state.models.includes(model);
        }
        return false;
    }

    addModel = (model)=>{
        const rmseData = this.state.rmseSummary.filter(data => data.id === model)[0].data;
        const maeData = this.state.maeSummary.filter(data => data.id === model)[0].data;
        const allData = {rmseData:rmseData, maeData:maeData};
        this.setState(
            prevState => ({
              models: [...prevState.models, model],
              mainGraphData: {
                ...prevState.mainGraphData,
                [model]: allData
            }
            }),() => {
                this.formRef.current.setFieldsValue({
                    models: this.state.models
                });
            });
    }

    removeModel = (targetModel)=>{
        this.setState(prevState =>{
            return {
                models: prevState.models.filter(model => model !== targetModel),
                mainGraphData: Object.keys(prevState.mainGraphData)
                .filter(model => model !== targetModel)
                .reduce((newMainGraphData, model) => {
                  return {
                    ...newMainGraphData,
                    [model]: prevState.mainGraphData[model]
                  };
                }, {})
            }
        }
        );
    }

    onValuesChange = (changedValues, allValues)=>{
        const prevModels = this.state.models;
        const newModels = allValues.models;
        if (newModels && prevModels)
        {
            const modelsToAdd = newModels.filter(
            model => !prevModels.includes(model)
            );
            const modelsToRemove = prevModels.filter(
            model => !newModels.includes(model)
            );
        
            modelsToAdd.forEach(this.addModel);
            modelsToRemove.forEach(this.removeModel);
        }
    }

    handleErrorTypeSelect = e =>{
        this.setState({
            errorType: e.target.value
        });
    }

    // parsePercentData = (result) =>{
    //     const percentSummary = result.data.map((csvRow, index) => {
    //         const model = {id: "", data: []};
    //         for (const col in csvRow) {
    //             if (col === "") {
    //                 model.id = csvRow[col];
    //             } else if (col.indexOf("perc_error_") >= 0 
    //             && csvRow[col] != null 
    //             && csvRow[col] != "") {
    //                 model.data.push({
    //                     x: col.substring(11, col.length),
    //                     y: parseInt(csvRow[col])
    //                 });
    //             } 
    //         }
    //         return model;
    //     });

    //     this.setState({
    //         percentSummary: percentSummary,
    //     });
    // }


    render() {
        const {
            rmseSummary,
            maeSummary,
            modelList,
            errorType,
            mainGraphData
            // percentSummary
        } = this.state;
        //console.log(mainGraphData);
        const modelOptions = modelList
        .filter(model => !this.modelIsSelected(model))
        .sort()
        .map(s => {
        return <Option key={s}> {s} </Option>;
        });

        return(
            <div className="graph-container">
                <Row type="flex" justify="space-around">
                    <Col span={10}>
                        <Form 
                            ref={this.formRef}
                            onValuesChange={this.onValuesChange}
                        >
                            <Form.Item
                                label="Models"
                                name="models"
                                rules={[{ required: true, message: "Please select models!" }]}
                            >
                                <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Select models"
                                >
                                {modelOptions}
                                </Select>
                            </Form.Item>
                        </Form>
                        <div className="radio-group">Error Type:&nbsp;&nbsp;  
                            <Radio.Group
                                value={errorType}
                                onChange={this.handleErrorTypeSelect}
                            >
                                <Radio value="rmse">Root Mean Square Error</Radio>
                                <Radio value="mae">Mean Absolute Error</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={24}>
                        <Leadergraph className="graph" data={mainGraphData} errorType={errorType} /> 
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Leaderboard;