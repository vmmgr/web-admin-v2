import React, {useEffect, useRef, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles"
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    InputBase,
    Paper, Radio, RadioGroup,
    Typography
} from "@material-ui/core";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {TemplateBaseData, VMListData} from "../../interface";
import {useSnackbar} from "notistack";
import {restfulApiConfig} from "../../Config";
import {VMStatus} from "../../components/Dashboard/Status/Status";
import {GetAll} from "../../api/Template";
import {VMCreateDialog} from "./VMCreateDialog";
import {useHistory} from "react-router-dom";

export default function VM() {
    const classes = useStyles();
    const [vms, setVMs] = useState<VMListData[]>();
    const [initVMs, setInitVMs] = useState<VMListData[]>();
    const [template, setTemplate] = useState<TemplateBaseData>();
    const [reload, setReload] = useState(true);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);
    const {sendMessage, lastMessage, readyState,} = useWebSocket(restfulApiConfig.wsURL + "/vm" +
        '?access_token=' + sessionStorage.getItem('ACCESS_TOKEN'), {
        onOpen: () => enqueueSnackbar("WebSocket接続確立", {variant: "success"}),
        onClose: () => enqueueSnackbar("WebSocket切断", {variant: "error"}),
        shouldReconnect: (closeEvent) => true,
    });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVMs(undefined);
        setInitVMs(undefined);
        sendMessage(JSON.stringify({
            access_token: sessionStorage.getItem('ACCESS_TOKEN'),
            type: 1
            // message: inputChatData
        }));
        setReload(false);
    }, [reload]);

    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setTemplate(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    useEffect(() => {
        let vmList: VMListData[] = [];
        console.log(lastMessage);
        if (lastMessage !== null) {
            console.log(lastMessage?.data);
            const obj = JSON.parse(lastMessage?.data);
            console.log(obj);
            // setBaseChatData(tmpChat => [...tmpChat, {
            //     admin: obj.admin,
            //     data: obj.message,
            //     time: obj.time,
            //     user_name: obj.username
            // }]);
            if (obj.type === 1) {
                if (obj.vm_detail == undefined) {
                    console.log("None");
                    return
                }
                for (const tmpVM of obj.vm_detail) {
                    console.log(tmpVM);
                    let bootDev: string[] = []

                    console.log(tmpVM.vm.OS.BootDevices);
                    for (const tmpBoot of tmpVM.vm.OS.BootDevices) {
                        bootDev.push(tmpBoot.Dev)
                    }
                    const vm: VMListData = {
                        node_id: tmpVM.node,
                        name: tmpVM.vm.Name,
                        uuid: tmpVM.vm.UUID,
                        status: tmpVM.stat,
                        type: tmpVM.vm.Type,
                        vcpu: tmpVM.vm.VCPU.Value,
                        vcpu_current: tmpVM.vm.VCPU.Current,
                        memory: tmpVM.vm.Memory.Value,
                        bootdev: bootDev,
                        type_arch: tmpVM.vm.OS.Arch,
                        type_machine: tmpVM.vm.OS.Type.Machine,
                    }
                    vmList.push(vm);
                }

                setVMs(vmList)
                setInitVMs(vmList)
                // if (obj.admin) {
                //     setMessagesetMessageenqueueSnackbar("送信しました。", {variant: "success"})
                // } else {
                //     enqueueSnackbar("新規メッセージがあります", {variant: "success"})
                // }
            } else if (obj.type === 10) {
                setMessage(obj.message)
                setProgress(obj.progress)
            }
            ref.current?.scrollIntoView()
        }
    }, [lastMessage]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const clickDetailPage = (nodeID: number, uuid: string) => {
        history.push('/dashboard/vm/' + nodeID + '/' + uuid);
    }

    const checkNode = (vm: VMListData) => {
        if (value === 2) {
            return vm.status === 1;
        } else if (value === 3) {
            return vm.status !== 1;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: VMListData[];
        if (initVMs != undefined) {
            if (search === "") {
                tmp = initVMs;
            } else {
                tmp = initVMs?.filter((vms: VMListData) => {
                    const name = vms.name
                    return name.toLowerCase().includes(search.toLowerCase())
                });
            }
            setVMs(tmp);
        }
    };

    return (
        <Dashboard title="VM Info">
            <VMCreateDialog key={"vm_create_dialog"} sendMessage={sendMessage} templateBase={template} message={message}
                            progress={progress}/>
            <br/>
            <Paper component="form" className={classes.rootInput}>
                <InputBase
                    className={classes.input}
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </Paper>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="すべて"/>
                    <FormControlLabel value={2} control={<Radio color="primary"/>} label="起動"/>
                    <FormControlLabel value={3} control={<Radio color="secondary"/>} label="起動以外"/>
                </RadioGroup>
            </FormControl>
            {
                vms?.filter(node => checkNode(node)).map((vm: VMListData) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
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
                            <Button size="small" onClick={() => clickDetailPage(vm.node_id, vm.uuid)}>Detail</Button>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
