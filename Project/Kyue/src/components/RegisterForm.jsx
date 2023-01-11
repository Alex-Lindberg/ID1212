import "./RegisterForm.css";

const RegisterForm = (props) => {
    return (
        <form
            onSubmit={(e) => {
                props.handleSubmitRegister(e);
            }}
            className="sign-up-html"
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
                <label className="label">Username</label>
                <input
                    id="username"
                    type="text"
                    className="input"
                    value={props.username}
                    onChange={(e) => props.setUsername(e.target.value)}
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
                    placeholder="Password"
                />
            </div>
            <div className="group">
                <input
                    id="pass2"
                    type="password"
                    className="input"
                    data-type="password"
                    value={props.passwordConfirm}
                    onChange={(e) => props.setPasswordConifrm(e.target.value)}
                    placeholder="Confirm Password"
                />
            </div>
            <div className="group">
                <input type="submit" className="button" value="Register" />
            </div>
        </form>
    );
};

export default RegisterForm;
