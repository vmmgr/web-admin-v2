import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl, FormControlLabel,
    InputBase,
    Paper, Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import {GetAll} from "../../api/Group";
import {useHistory} from "react-router-dom";
import {GroupDetailData} from "../../interface";
import {useSnackbar} from "notistack";


export default function Group() {
    const [groups, setGroups] = useState<GroupDetailData[]>();
    const [initGroups, setInitGroups] = useState<GroupDetailData[]>();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);

    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setGroups(res.data);
                setInitGroups(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkGroup = (group: GroupDetailData) => {
        if (value === 1) {
            return group.enable;
        } else if (value === 2) {
            return !group.enable;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: GroupDetailData[] | undefined;
        if (search === "") {
            tmp = initGroups;
        } else {
            tmp = initGroups?.filter((grp: GroupDetailData) => {
                return grp.org.toLowerCase().includes(search.toLowerCase())
            });
        }
        setGroups(tmp);
    };

    function clickDetailPage(id: number) {
        history.push('/dashboard/group/' + id);
    }

    return (
        <Dashboard title="Group Info">
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
                <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            {
                groups?.filter(group => checkGroup(group)).map((group: GroupDetailData) => (
                    <Card sx={{
                        minWidth: 275,
                        marginBottom: 5,
                    }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom sx={{fontSize: 14}}>
                                ID: {group.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {group.org}
                            </Typography>
                            {/*<Typography className={classes.pos} color="textSecondary">*/}
                            {/*    {group.user}*/}
                            {/*</Typography>*/}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => clickDetailPage(group.ID)}>Detail</Button>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
