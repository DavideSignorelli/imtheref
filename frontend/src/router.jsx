import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Signup from "./pages/signup.jsx";
import Logout from "./pages/logout.jsx";

function RequireAuth({ children }) {
    const [loggedIn, setLoggedIn] = useState();

    useEffect(() => {
        fetch("/api/user/isLoggedIn", { credentials: "include" })
            .then((res) => setLoggedIn(res.status === 200))
    }, [])

    if (loggedIn === undefined) {
        return <div className="App">Loading...</div>;
    }
    return loggedIn ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "signup",
        element: <Signup />,
    },
    {
        path: "/",
        element: <Navigate to="/home" replace />,
    },
    {
        path: "home",
        element: (
            <RequireAuth>
                <Home />
            </RequireAuth>
        ),
    },
    {
        path: "logout",
        element: (
            <RequireAuth>
                <Logout />
            </RequireAuth>
        ),
    }
]);
export default router;