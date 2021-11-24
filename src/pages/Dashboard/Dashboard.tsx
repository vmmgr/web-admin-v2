import React, {useEffect, useState} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {useSnackbar} from "notistack";
import {Grid} from "@mui/material";


export default function Dashboard() {
    const {enqueueSnackbar} = useSnackbar();
    const [reload, setReload] = useState(true)

    useEffect(() => {
        if (reload) {

        }
    }, [reload]);

    useEffect(() => {

    }, []);

    return (
        <DashboardComponent title="Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {/*<Ticket key={"ticket"} data={ticket} setReload={setReload}/>*/}
                </Grid>
                <Grid item xs={12}>
                    {/*<Request key={"request"} data={request} setReload={setReload}/>*/}
                </Grid>
                <Grid item xs={12}>
                    {/*<Service key={"service"} data={service} template={template} setReload={setReload}/>*/}
                </Grid>
                <Grid item xs={12}>
                    {/*<Connection key={"connection"} data={connection} template={template} setReload={setReload}/>*/}
                </Grid>
                <Grid item xs={12}>
                    {/*<Group key={"group"} data={template?.group} setReload={setReload}/>*/}
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}
