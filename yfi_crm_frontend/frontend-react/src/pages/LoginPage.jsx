import { useState } from "react";
import {useNavigate} from "react-router-dom"
export default function LoginPage() {
    const navigate =useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("submit triggered", formData);

        const response = await fetch("http://127.0.0.1:8000/login/",
             {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
});

        if (response.ok) {
            let responseData = await response.json();
            console.log("login success",responseData)

            localStorage.setItem("accessToken", responseData.access);

            if (responseData.refresh) {
                localStorage.setItem("refreshToken", responseData.refresh);
            }
            navigate("/dashboard")
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    value={formData.username}
                    onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                    }
                    type="text"
                    placeholder="Username"
                />

                <input
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    type="password"
                    placeholder="Password"
                />

                <button type="submit">Login</button>
            </form>
        </>
    );
}