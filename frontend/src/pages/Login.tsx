import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { login } from "../services/auth.react";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [reqSent, setReqSent] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const saveUser = (user: object) => {
        localStorage.setItem("user", JSON.stringify(user));
        console.log(localStorage.getItem("user"));
    }

    const saveToken = (token: string) => {
        localStorage.setItem("token", token);
    }

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();

        // validation

        // send request
        setReqSent(true);
        const res = await login({username, password});
        setReqSent(false);


        //handle response
        const data = await res.json();

        if(res.ok)
        {
            toast.success("Login successfully");
            const user = data.user;
            const token = data.token;

            // save user data and token
            saveUser(user);
            saveToken(token);

            // role base control
            console.log(user);
            if(user.role === "admin")
            {
                console.log("navigating to admin dashboard");
                navigate('/adminDashboard');
            }
            else
            {
                navigate('/userDashboard');
            }
        }
        else
        {
            toast.error("Login failed");
            setError(data.message);
        }

    }
    
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

                <input  data-testid = "username-input" value = {username} type="text" placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}} />
                <input data-testid = "password-input" value = {password} placeholder="Password" onChange = {(e)=>{setPassword(e.target.value)}} />
                
                <button data-testid = "submit-button" type="submit">Login</button>
            </form>

            {
                reqSent && <p data-testid = "loading">Waiting for response from Server</p>
            }
            {
                error && <p data-testid = "error">Error: {error}</p>
            }
        </div>
    )
}