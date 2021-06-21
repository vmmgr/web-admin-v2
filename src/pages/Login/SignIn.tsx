import {
    Avatar,
    Button, Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    makeStyles,
    TextField, ThemeProvider, Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {colorTheme} from '../../components/Theme';
import React, {FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Login} from "../../api/Auth";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const history = useHistory();
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const {enqueueSnackbar} = useSnackbar();

    const handleSubmit = (e: FormEvent) => {
        console.log(mail);
        console.log(password);
        e.preventDefault();
        Login(mail, password).then(res => {
            if (res.error === "") {
                console.log("OK");
                history.push('/dashboard');
            } else {
                console.log("NG");
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        });
    }

    return (
        <ThemeProvider theme={colorTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="UserName"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            defaultValue=""
                            onChange={event => setMail(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            defaultValue=""
                            onChange={event => setPassword(event.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
                {/*<Box mt={8}>*/}
                {/*    <Copyright/>*/}
                {/*</Box>*/}
            </Container>
        </ThemeProvider>
    );
}
