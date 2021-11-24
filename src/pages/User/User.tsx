import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
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
} from "@mui/material";
import {GetAll} from "../../api/User";
import {GetAll as TemplateGetAll} from "../../api/Template";
import {TemplateBaseData, UserDetailData} from "../../interface";
import {useSnackbar} from "notistack";
import {UserAddDialogs} from "./UserAddDialog";


export default function User() {
    const [users, setUsers] = useState<UserDetailData[]>();
    const [initUsers, setInitUsers] = useState<UserDetailData[]>();
    const [template, setTemplate] = useState<TemplateBaseData>();
    const [createOpen, setCreateOpen] = useState(false);
    const [reload, setReload] = useState(true);
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);


    useEffect(() => {
        if (reload) {
            setReload(false);
            setUsers(undefined)
            setInitUsers(undefined)

            GetAll().then(res => {
                if (res.error === "") {
                    console.log(res);
                    setUsers(res.data);
                    setInitUsers(res.data);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
            TemplateGetAll().then(res => {
                if (res.error === "") {
                    console.log(res);
                    setTemplate(res.data);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
    }, [reload]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkUser = (user: UserDetailData) => {
        if (value === 1) {
            return user.expired_status === 0;
        } else if (value === 2) {
            return user.expired_status !== 0;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: UserDetailData[];
        if (initUsers != undefined) {
            if (search === "") {
                tmp = initUsers;
            } else {
                tmp = initUsers.filter((users: UserDetailData) => {
                    const name = users.name + users.name_en
                    return name.toLowerCase().includes(search.toLowerCase())
                });
            }
            setUsers(tmp);
        }
    };

    return (
        <Dashboard title="User Info">
            <Paper component="form" sx={{minWidth: 100, marginBottom: 1}}>
                <InputBase
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                    sx={{marginLeft: 1, flex: 1}}
                />
            </Paper>
            <Button size="small" color={"primary"} onClick={() => setCreateOpen(true)}>追加</Button>
            <br/>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            <br/>
            {
                users?.filter(user => checkUser(user)).map((user: UserDetailData) => (
                    <Card sx={{minWidth: 275, marginBottom: 1}}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom sx={{fontSize: 14}}>
                                ID: {user.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {user.name} ({user.name_en})
                            </Typography>
                            <br/>
                        </CardContent>
                        <CardActions>
                            {/*<Button size="small" onClick={() => clickDetailPage(notice.ID)}>Detail</Button>*/}
                        </CardActions>
                    </Card>
                ))
            }
            <UserAddDialogs open={createOpen} setOpen={setCreateOpen} template={template} setReload={setReload}/>
        </Dashboard>
    );
}
