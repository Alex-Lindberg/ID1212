import React from "react";
import { useState } from "react";
import { login } from "../api/user";
import "./LoginForm.css";

const LoginForm = ({}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        login({email: email, password: password}).then((t) => {
            console.log('result :>> ', t);
        }).catch(console.error)
    };
    return (
        <form onSubmit={(e) => handleSubmit(e)} className="login-form">
            <div className="group">
                <label for="email" className="label">
                    Email
                </label>
                <input
                    id="email"
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="group">
                <label for="pass" className="label">
                    Password
                </label>
                <input
                    id="pass"
                    type="password"
                    className="input"
                    data-type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="group">
                <input type="submit" className="button" value="Sign In" />
            </div>
        </form>
    );
};

export default LoginForm;
