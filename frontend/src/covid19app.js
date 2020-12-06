import React, { Component } from "react";
import Covid19Predict from "./covid19predict";
import AboutUS from "./aboutus";
import ScorePage from './scorePage/scorePage';
import {HashRouter, Route, Redirect, Switch} from 'react-router-dom'; 
import Navbar from "./navbar/navbar";
import 'semantic-ui-css/semantic.min.css';
import "./covid19app.css";
import Leaderboard from "./leaderboard/leaderboard";
import Highlights from "./highlights/highlights";

//import pdf from "./highlights.pdf";

class Covid19App extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirectForecast: false,
      redirectAbout: false,
      redirectScore: false,
      redirectLeaderboard: false,
      redirectHighlights: false
    }
  }

  redirectForecast = ()=>{
    this.setState({
      redirectForecast:true,
      redirectAbout: false,
      redirectScore: false,
      redirectLeaderboard: false,
      redirectHighlights: false
    });
  }

  redirectAbout = ()=>{
    this.setState({
      redirectForecast: false,
      redirectAbout:true,
      redirectScore: false,
      redirectLeaderboard: false,
      redirectHighlights: false
    });
  }

  redirectScore = ()=>{
    this.setState({
      redirectForecast: false,
      redirectAbout:false,
      redirectScore: true,
      redirectHighlights: false,
      redirectLeaderboard: false
    });
  }

  redirectLeaderboard = ()=>{
    this.setState({
      redirectForecast: false,
      redirectAbout: false,
      redirectScore: false,
      redirectLeaderboard: true,
      redirectHighlights: false
    });
  }

  redirectHighlights = ()=>{
    this.setState({
      redirectForecast: false,
      redirectAbout: false,
      redirectScore: false,
      redirectLeaderboard: false,
      redirectHighlights: true
    });
  }

  render() {
    const {redirectForecast, redirectAbout, redirectScore, redirectLeaderboard, redirectHighlights} = this.state;
    return (
      <HashRouter basename="/">
        {redirectForecast?<Redirect to="/"/>:null}
        {redirectHighlights?<Redirect to="/highlights"/>:null}
        {redirectScore?<Redirect to="/score"/>:null}
        {redirectAbout?<Redirect to="/about"/>:null}
        {redirectLeaderboard?<Redirect to="/leaderboard"/>:null}
        <Navbar redirectForecast = {this.redirectForecast}
        		redirectHighlights = {this.redirectHighlights}
                redirectScore = {this.redirectScore}
                redirectAbout = {this.redirectAbout}
                redirectLeaderboard = {this.redirectLeaderboard}
        />
        <Switch>
          <Route exact path='/' 
            render={(props) => <Covid19Predict {...props} />}/>
          <Route exact path='/score' 
            render={(props) => <ScorePage {...props}/>}
          />
          <Route exact path='/about'
            render={(props) => <AboutUS {...props} />} />
          <Route exact path='/leaderboard' 
            render={(props) => <Leaderboard {...props} />}/>
          <Route exact path='/highlights'
            render={(props) => <Highlights {...props} />}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default Covid19App;
