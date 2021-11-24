import {
    Avatar, Box,
    Button, Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    TextField, ThemeProvider, Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {colorTheme} from '../../components/Theme';
import React, {FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Login} from "../../api/Auth";
import {useSnackbar} from "notistack";

export default function SignIn() {
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
                <Box sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Avatar sx={{
                        margin: 1,
                        backgroundColor: 'secondary.main'
                    }}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >
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
                            sx={{
                                marginTop: 3,
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 2
                            }}
                        >
                            Sign In
                        </Button>
                    </form>
                </Box>
                {/*<Box mt={8}>*/}
                {/*    <Copyright/>*/}
                {/*</Box>*/}
            </Container>
        </ThemeProvider>
    );
}
