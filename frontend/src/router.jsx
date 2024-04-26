import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Signup from "./pages/signup.jsx";
import Logout from "./pages/logout.jsx";
import Rimborsi from "./pages/rimborsi.jsx";
import Voti from "./pages/voti.jsx";
import Categorie from "./pages/categorie.jsx";
import Sidebar from "./components/sidebar.jsx";

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
                <Sidebar />
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
    },
    {
        path: "rimborsi",
        element: (
            <RequireAuth>
                <Sidebar />
                <Rimborsi />
            </RequireAuth>
        ),
    },
    {
        path: "voti",
        element: (
            <RequireAuth>
                <Sidebar />
                <Voti />
            </RequireAuth>
        ),
    },
    {
        path: "categorie",
        element: (
            <RequireAuth>
                <Sidebar />
                <Categorie />
            </RequireAuth>
        ),
    },
]);
export default router;