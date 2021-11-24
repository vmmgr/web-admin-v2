import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    InputBase,
    Paper, Radio, RadioGroup,
    Typography
} from "@mui/material";
import {GetAll} from "../../api/Node";
import {NodeDetailData} from "../../interface";
import {useSnackbar} from "notistack";

export default function Node() {
    const [nodes, setNodes] = useState<NodeDetailData[]>();
    const [initNodes, setInitNodes] = useState<NodeDetailData[]>();
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);


    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setNodes(res.data);
                setInitNodes(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkNode = (node: NodeDetailData) => {
        if (value === 1) {
            return node.enable;
        } else if (value === 2) {
            return !node.enable;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: NodeDetailData[];
        if (initNodes != undefined) {
            if (search === "") {
                tmp = initNodes;
            } else {
                tmp = initNodes?.filter((nodes: NodeDetailData) => {
                    const name = nodes.name
                    return name.toLowerCase().includes(search.toLowerCase())
                });
            }
            setNodes(tmp);
        }
    };

    return (
        <Dashboard title="Node Info">
            <Paper component="form" sx={{
                minWidth: 100,
                marginBottom: 1,
            }}>
                <InputBase
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                    sx={{
                        marginLeft: 1,
                        flex: 1,
                    }}
                />
            </Paper>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            {
                nodes?.filter(node => checkNode(node)).map((node: NodeDetailData) => (
                    <Card sx={{
                        minWidth: 275,
                        marginBottom: 5,
                    }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom sx={{fontSize: 14}}>
                                ID: {node.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {node.name} ({node.ip}:{node.port})
                            </Typography>
                            <br/>
                        </CardContent>
                        <CardActions>
                            {/*<Button size="small" onClick={() => clickDetailPage(notice.ID)}>Detail</Button>*/}
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
