import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from "./pages/Dashboard/Dashboard";
import Node from "./pages/Node/Node";
import SignIn from "./pages/Login/SignIn";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/login" exact/>
                    <Route exact path="/login" component={SignIn}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route exact path="/dashboard/node" component={Node}/>
                </Switch>
            </BrowserRouter>
        )
    }
}