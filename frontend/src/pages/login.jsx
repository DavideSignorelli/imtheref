import * as React from 'react';
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Links from '@mui/joy/Link';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';






function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    async function login() {
        event.preventDefault(); // Previeni il comportamento predefinito di submit del modulo
        const dati = {
            password,
            email
        };
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dati)
        });

        console.log(response.status);
        console.log(document.getElementById("loginErrato").hidden);
        if (response.status === 401) {
            document.getElementById("loginErrato").hidden = true;
        }
        else {
            const result = await response.json();

            if (response.status !== 200) {
                alert(result.message);
            }
            navigate("/home");

        }

    }

    const [loggedIn, setLoggedIn] = useState();

    useEffect(() => {
        fetch("/api/user/isLoggedIn", { credentials: "include" })
            .then((res) => setLoggedIn(res.status === 200))
    }, [])

    if (loggedIn === true) {
        navigate("/home");
    }



    return (
        <CssVarsProvider>
            <Sheet
                sx={{
                    width: 300,
                    mx: 'auto', // margin left & right
                    my: 4, // margin top & bottom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                }}
            >
                <Typography level="h4" component="h1">
                    IMTHEREF
                </Typography>
                <Typography level="body-sm">Accesso al portale</Typography>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        // html input attribute
                        name="email"
                        type="email"
                        placeholder="johndoe@email.com"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Typography
                        fontSize="sm"
                        style={{ color: 'red', visibility: 'hidden' }}
                        id="loginErrato"

                    >
                        Email o password sbagliata
                    </Typography>
                </FormControl>
                <FormControl>
                    <Button
                        sx={{ mt: 1 /* margin top */ }}
                        onClick={login}
                    >
                        Log in
                    </Button>
                </FormControl>
                <FormControl>
                    <Typography
                        endDecorator={<Links href="/signup">Sign up</Links>}
                        fontSize="sm"
                        sx={{ alignSelf: 'center' }}
                    >
                        Don't have an account?
                    </Typography>
                </FormControl>

            </Sheet>
        </CssVarsProvider>
    );
}

export default Login;