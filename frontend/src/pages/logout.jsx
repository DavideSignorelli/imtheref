import * as React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Logout() {
    const navigate = useNavigate();
    async function logout() {
        const response = await fetch("/api/user/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    }

    React.useEffect(() => {
        logout().then(() => {
            navigate("/login");
        });
    }, []);

    return (
        <div>
            <h1>Logout</h1>
        </div>
    );
}