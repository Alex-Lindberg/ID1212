import React from "react";
import "./LoginForm.css";

const LoginForm = (props) => {
    return (
        <form
            onSubmit={(e) => props.handleSubmitLogin(e)}
            className="sign-in-html"
        >
            <div className="group">
                <label className="label">Email</label>
                <input
                    id="email"
                    type="text"
                    className="input"
                    value={props.email}
                    onChange={(e) => props.setEmail(e.target.value)}
                />
            </div>
            <div className="group">
                <label className="label">Password</label>
                <input
                    id="pass"
                    type="password"
                    className="input"
                    data-type="password"
                    value={props.password}
                    onChange={(e) => props.setPassword(e.target.value)}
                />
            </div>
            <div className="group">
                <input type="submit" className="button" value="Sign In" />
            </div>
        </form>
    );
};

export default LoginForm;
