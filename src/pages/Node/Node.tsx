import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles"
import {
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    InputBase,
    Paper, Radio, RadioGroup,
    Typography
} from "@material-ui/core";
import {GetAll} from "../../api/Node";
import {NodeDetailData} from "../../interface";
import {useSnackbar} from "notistack";

export default function Node() {
    const classes = useStyles();
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
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            {
                nodes?.filter(node => checkNode(node)).map((node: NodeDetailData) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
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
