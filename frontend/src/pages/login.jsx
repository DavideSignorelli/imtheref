import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dati)
            });

            const result = await response.json();
            if (response.status !== 200) {
                alert(result.message);
            }
            navigate("/home");
        } catch (error) {
            console.error("Error:", error);
            alert("Errore durante il login " + error);
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
        <div id="box">
            <div>
                <h1>Accesso al portale</h1>
                <form onSubmit={login}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input onChange={(event) => setEmail(event.target.value)}
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Inserisci la tua email"
                            required=""
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Inserisci la tua password"
                            required=""
                        />
                        <p id='loginErrato' style={{ color: 'red', fontSize: '15px', visibility: 'hidden' }}>*L'Email o la Password sono sbagliati</p>
                    </div>
                    <div>
                        <button onClick={login} id="loginButton">Login</button>
                        <Link to="/signup">
                            <button id="resetPasswordButton">Registrati</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;