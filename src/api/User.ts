import axios from "axios";
import {restfulApiConfig} from "../Config";
import {UserCreateData} from "../interface";

export function Post(data:UserCreateData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/user", data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.user
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function GetAll(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/user", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        console.log(res.data);
        return {
            error: "",
            data: res.data
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}
