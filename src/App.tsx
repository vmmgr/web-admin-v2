import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/Login/SignIn";
import User from "./pages/User/User";
import Token from "./pages/Token/Token";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Node from "./pages/Node/Node";
import VM from "./pages/VM/VM";
import Group from "./pages/Group/Group";
import {VMDetail} from "./pages/VM/VMDetail";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/login" exact/>
                    <Route exact path="/login" component={SignIn}/>
                    <Route exact path="/dashboard" component={Dashboard}/>
                    <Route exact path="/dashboard/group" component={Group}/>
                    <Route exact path="/dashboard/node" component={Node}/>
                    <Route exact path="/dashboard/vm" component={VM}/>
                    <Route exact path="/dashboard/vm/:node_id/:uuid" component={VMDetail}/>
                    <Route exact path="/dashboard/token" component={Token}/>
                    <Route exact path="/dashboard/user" component={User}/>
                </Switch>
            </BrowserRouter>
        )
    }
}