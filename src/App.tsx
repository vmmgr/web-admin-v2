import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/Login/SignIn";
import User from "./pages/User/User";
import Token from "./pages/Token/Token";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/login" exact/>
                    <Route exact path="/login" component={SignIn}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route exact path="/dashboard/token" component={Token}/>
                    <Route exact path="/dashboard/user" component={User}/>
                </Switch>
            </BrowserRouter>
        )
    }
}