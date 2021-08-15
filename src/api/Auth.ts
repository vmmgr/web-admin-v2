import axios from "axios";
import {restfulApiConfig} from "../Config";

export function Login(username: string, password: string): Promise<{ error: string, data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/login", null, {
        headers: {
            'Content-Type': 'application/json',
            'USER': username,
            'PASS': password
        }
    }).then(res => {
        console.log(res.data.token[0]);
        sessionStorage.setItem("ACCESS_TOKEN", res.data.token[0].access_token);
        return {
            error: "",
            data: res.data.token[0]
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}

export function Logout(): Promise<string> {
    return axios.post(restfulApiConfig.apiURL + "/logout", {}, {
        headers: {
            'Content-Type': 'application/json',
            'ACCESS_TOKEN': sessionStorage.getItem('ACCESS_TOKEN'),
        }
    }).then(res => {
        console.log(res.data.token[0]);
        return "";
    }).catch(err => {
        console.log(err);
        return err;
    })
}

// export const login = Login
