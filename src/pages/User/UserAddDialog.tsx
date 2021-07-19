import React, {Dispatch, SetStateAction} from 'react';
import useStyles from "../VM/style"
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, FormControlLabel, Grid,
    InputLabel, MenuItem,
    Radio,
    RadioGroup, Select, TextField,
} from "@material-ui/core";
import {
    DefaultUserCreateData,
    TemplateBaseData,
} from "../../interface";
import shaJS from "sha.js";
import {useSnackbar} from "notistack";
import {Post} from '../../api/User';

export function UserAddDialogs(props: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    template: TemplateBaseData | undefined,
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const classes = useStyles();
    const {open, setOpen, template, setReload} = props
    const [data, setData] = React.useState(DefaultUserCreateData);
    const {enqueueSnackbar} = useSnackbar();

    const request = () => {
        const passHash: string = shaJS('sha256').update(data.pass).digest('hex');
        data.pass = passHash;
        console.log(data);
        Post(data).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                setOpen(false);
                setReload(true);
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
        })
        enqueueSnackbar('OK', {variant: "success"});
    }

    return (
        <div>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    Userの追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <h3>グループ選択</h3>
                            <FormControl className={classes.formSelect}>
                                <InputLabel>Group指定</InputLabel>
                                <Select
                                    labelId="group_id"
                                    id="group_id"
                                    onChange={(event) => {
                                        setData({...data, group_id: Number(event.target.value)})
                                    }}
                                >
                                    <MenuItem key={"group_id_0"} value={0}>0: グループ新規作成</MenuItem>
                                    {
                                        template?.group?.map((row, index) => (
                                            <MenuItem key={"group_id_" + row.ID}
                                                      value={row.ID}>{row.ID}: {row.org}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <br/>
                            <h3>Level</h3>
                            <RadioGroup row aria-label="level" name="level" value={data.level}
                                        onChange={(event) => {
                                            setData({...data, level: Number(event.target.value)})
                                        }}>
                                <FormControlLabel checked={data.level === 1}
                                                  value={1}
                                                  control={<Radio color="primary"/>}
                                                  label="Master(Root)"/>
                                <FormControlLabel checked={data.level === 2}
                                                  value={2}
                                                  disabled={data.group_id === 0}
                                                  control={<Radio color="primary"/>}
                                                  label="Master(Group)"/>
                                <FormControlLabel checked={data.level === 3}
                                                  value={3}
                                                  disabled={data.group_id === 0}
                                                  control={<Radio color="primary"/>}
                                                  label="User(Group)"/>
                            </RadioGroup>
                            <br/>
                            <h3>メール確認</h3>
                            <RadioGroup row aria-label="mail_verify" name="mail_verify" value={data.mail_verify}
                                        onChange={(event) => {
                                            if (Number(event.target.value) === 1) {
                                                setData({...data, mail_verify: false})
                                            } else {
                                                setData({...data, mail_verify: true})
                                            }
                                        }}>
                                <FormControlLabel checked={!data.mail_verify} value={1}
                                                  control={<Radio color="secondary"/>} label="メール送信確認をしない"/>
                                <FormControlLabel checked={data.mail_verify} value={2}
                                                  control={<Radio color="primary"/>} label="メール送信確認をする"/>
                            </RadioGroup>
                            <br/>
                            <TextField
                                className={classes.formMedium}
                                required
                                id="name"
                                label="name"
                                value={data.name}
                                variant="outlined"
                                onChange={event => {
                                    setData({...data, name: event.target.value});
                                }}
                            />
                            <br/>
                            <TextField
                                className={classes.formMedium}
                                required
                                id="E-Mail"
                                label="E-Mail"
                                value={data.mail}
                                type={"email"}
                                variant="outlined"
                                onChange={event => setData({...data, mail: event.target.value})}
                            />
                            <TextField
                                className={classes.formMedium}
                                required
                                id="pass"
                                label="pass"
                                value={data.pass}
                                type={"password"}
                                variant="outlined"
                                onChange={event => setData({...data, pass: event.target.value})}
                            />
                            <br/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
