import React, {useEffect, useRef, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography
} from "@mui/material";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {TemplateBaseData, VMListData} from "../../interface";
import {useSnackbar} from "notistack";
import {restfulApiConfig} from "../../Config";
import {VMStatus} from "../../components/Dashboard/Status/Status";
import {GetAll} from "../../api/Template";
import {VMCreateDialog} from "./VMCreateDialog";
import {useParams} from 'react-router-dom';

export function VMDetail() {
    const [vm, setVM] = useState<VMListData>();
    const [template, setTemplate] = useState<TemplateBaseData>();
    const [reload, setReload] = useState(true);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    let node_id: string;
    ({node_id} = useParams());
    let uuid: string;
    ({uuid} = useParams());
    const {enqueueSnackbar} = useSnackbar();
    const {sendMessage, lastMessage, readyState,} = useWebSocket(restfulApiConfig.wsURL + "/vm" +
        '?access_token=' + sessionStorage.getItem('ACCESS_TOKEN'), {
        onOpen: () => enqueueSnackbar("WebSocket接続確立", {variant: "success"}),
        onClose: () => enqueueSnackbar("WebSocket切断", {variant: "error"}),
        shouldReconnect: (closeEvent) => true,
    });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (reload) {
            setReload(false);

            GetAll().then(res => {
                if (res.error === "") {
                    console.log(res);
                    setTemplate(res.data);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
            sendMessage(JSON.stringify({
                access_token: sessionStorage.getItem('ACCESS_TOKEN'),
                type: 0,
                node_id: Number(node_id),
                uuid: uuid
            }));
        }
    }, [reload]);

    useEffect(() => {
        console.log(lastMessage);
        if (lastMessage !== null) {
            const obj = JSON.parse(lastMessage?.data);
            console.log(obj);
            if (obj.type === 0) {
                if (obj.vm_detail == undefined) {
                    console.log("None");
                    return
                }
                console.log(obj.vm_detail[0]);
                let bootDev: string[] = []

                console.log(obj.vm_detail[0].vm.OS.BootDevices);
                for (const tmpBoot of obj.vm_detail[0].vm.OS.BootDevices) {
                    bootDev.push(tmpBoot.Dev)
                }
                const vm: VMListData = {
                    node_id: obj.vm_detail[0].node,
                    name: obj.vm_detail[0].vm.Name,
                    uuid: obj.vm_detail[0].vm.UUID,
                    status: obj.vm_detail[0].stat,
                    type: obj.vm_detail[0].vm.Type,
                    vcpu: obj.vm_detail[0].vm.VCPU.Value,
                    vcpu_current: obj.vm_detail[0].vm.VCPU.Current,
                    memory: obj.vm_detail[0].vm.Memory.Value,
                    bootdev: bootDev,
                    type_arch: obj.vm_detail[0].vm.OS.Arch,
                    type_machine: obj.vm_detail[0].vm.OS.Type.Machine,
                }

                setVM(vm)
            } else if (obj.type === 10) {
                setMessage(obj.message)
                setProgress(obj.progress)
            } else if (20 <= obj.type && obj.type < 30) {
                if (obj.status) {
                    if (vm !== undefined) {
                        setVM({...vm, status: obj.vm_detail[0].stat});
                    }
                    enqueueSnackbar("成功しました", {variant: "success"});
                } else {
                    enqueueSnackbar("" + obj.err, {variant: "error"});
                }
            }
            ref.current?.scrollIntoView()
        }
    }, [lastMessage]);

    const openURL = (url: string) => {
        console.log(url);
        window.open(url, '_blank');
    }

    const clickStartVM = () => {
        sendMessage(JSON.stringify({
            access_token: sessionStorage.getItem('ACCESS_TOKEN'),
            type: 20,
            node_id: Number(node_id),
            uuid: uuid,
        }));
    }

    const clickShutdownForceVM = () => {
        sendMessage(JSON.stringify({
            access_token: sessionStorage.getItem('ACCESS_TOKEN'),
            type: 21,
            node_id: Number(node_id),
            uuid: uuid,
        }));
    }

    const clickShutdownVM = () => {
        sendMessage(JSON.stringify({
            access_token: sessionStorage.getItem('ACCESS_TOKEN'),
            type: 22,
            node_id: Number(node_id),
            uuid: uuid,
        }));
    }

    const clickResetVM = () => {
        sendMessage(JSON.stringify({
            access_token: sessionStorage.getItem('ACCESS_TOKEN'),
            type: 23,
            node_id: Number(node_id),
            uuid: uuid,
        }));
    }

    return (
        <Dashboard title="VM">
            <Card sx={{minWidth: 100, marginBottom: 1}}>
                {
                    vm === undefined &&
                    <h2>データがありません</h2>
                }
                {
                    vm !== undefined &&
                    <div>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom sx={{fontSize: 14}}>
                                ID: {vm.uuid}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {vm.name}
                            </Typography>
                            <VMStatus key={"status"} status={vm.status}/>
                            <br/><br/>
                            CPU: {vm.vcpu} Memory: {vm.memory}KB
                        </CardContent>
                        <CardActions>
                            <Button variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        openURL(template?.novnc_url + "/" +
                                            sessionStorage.getItem('ACCESS_TOKEN') + "/" + node_id + "/" + uuid)}>NoVNC</Button>
                            <br/>
                            <Button
                                size="small"
                                color={"primary"}
                                disabled={vm.status === 1}
                                onClick={() => clickStartVM()}>Start</Button>
                            <Button
                                size="small"
                                color={"secondary"}
                                onClick={() => clickShutdownForceVM()}>Shutdown(Force)</Button>
                            <Button
                                size="small"
                                color={"secondary"}
                                onClick={() => clickShutdownVM()}>Shutdown</Button>
                            <Button
                                size="small"
                                onClick={() => clickResetVM()}>Reset</Button>
                        </CardActions>
                    </div>
                }
            </Card>

        </Dashboard>
    );
}
