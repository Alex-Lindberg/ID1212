import React from "react";
import { useState } from "react";
import { login, register } from "../api/user";
import "./LoginForm.css";

const LoginForm = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConifrm] = useState("");
    const [username, setUsername] = useState("");
    const [registerToggle, setRegisterToggle] = useState(false);
    const [error, setError] = useState("");

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        if (notValidEmail()) {
            setError("Email is invalid");
            return;
        }
        try {
            await login({ email: email, password: password });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        if (notValidEmail()) {
            setError("Email is invalid");
            return;
        }
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }
        try {
            const succeeded = await register({
                username: username,
                email: email,
                password: password,
            });
            if (succeeded) {
                await login({
                    email: email,
                    password: password,
                });
            } else {
                [
                    setEmail,
                    setPassword,
                    setUsername,
                    setPasswordConifrm,
                ].forEach((f) => f(""));
            }
        } catch (e) {
            console.error(e);
        }
    };
    const notValidEmail = () => {
        return (
            email.length > 0 &&
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i.test(email)
        );
    };

    return (
        <div
            className="login-html"
            style={registerToggle ? { height: "670px" } : {}}
        >
            <input
                id="tab-1"
                type="radio"
                name="tab"
                className="sign-in"
                defaultChecked={true}
                onChange={() => setRegisterToggle(false)}
            />
            <label htmlFor="tab-1" className="tab">
                Sign In
            </label>
            <input
                id="tab-2"
                type="radio"
                name="tab"
                className="sign-up"
                onChange={() => setRegisterToggle(true)}
            />
            <label htmlFor="tab-2" className="tab">
                Sign Up
            </label>
            <div className="forms ">
                <form
                    onSubmit={(e) => handleSubmitLogin(e)}
                    className="sign-in-html"
                >
                    <div className="group">
                        <label className="label">Email</label>
                        <input
                            id="email"
                            type="text"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="group">
                        <label className="label">Password</label>
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
                        <input
                            type="submit"
                            className="button"
                            value="Sign In"
                        />
                    </div>
                </form>
                <form
                    onSubmit={(e) => handleSubmitRegister(e)}
                    className="sign-up-html"
                >
                    <div className="group">
                        <label className="label">Email</label>
                        <input
                            id="email"
                            type="text"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="group">
                        <label className="label">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="group">
                        <label className="label">Password</label>
                        <input
                            id="pass"
                            type="password"
                            className="input"
                            data-type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <div className="group">
                        <input
                            id="pass2"
                            type="password"
                            className="input"
                            data-type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConifrm(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </div>
                    <div className="group">
                        <input
                            type="submit"
                            className="button"
                            value="Register"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
