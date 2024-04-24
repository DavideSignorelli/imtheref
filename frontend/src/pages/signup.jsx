import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Links from '@mui/joy/Link';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [loggedIn, setLoggedIn] = useState();
    const navigate = useNavigate();

    async function signup() {
        event.preventDefault();
        const dati = {
            password,
            email
        };
        const response = await fetch("/api/user/registrazione", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dati)
        });
        if (response.status === 200) {
            navigate("/login");
        }
    }

    useEffect(() => {
        fetch("/api/user/isLoggedIn", { credentials: "include" })
            .then((res) => setLoggedIn(res.status === 200))
    }, [])

    if (loggedIn === true) {
        navigate("/home");
    }


    return (
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
                Registrazione
            </Typography>
            <Typography level="body-sm">Registrazione al portale</Typography>
            <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                    name="email"
                    type="email"
                    placeholder="imtheref@email.com"
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
            </FormControl>
            <FormControl>
                <Button
                    sx={{ mt: 1 /* margin top */ }}
                    onClick={signup}
                >
                    Sign up
                </Button>
            </FormControl>
            <FormControl>
                <Typography
                    endDecorator={<Links href="/login">Log in</Links>}
                    fontSize="sm"
                    sx={{ alignSelf: 'center' }}
                >
                    Already have an account?
                </Typography>
            </FormControl>
        </Sheet>
    )
}

export default Signup;