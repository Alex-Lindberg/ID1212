import { LoginForm, MessageBox, RegisterForm } from "../components";
import { useState } from "react";
import { login, register } from "../api";
import useUserState from "../hooks/useUserState";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useMessageBox from "../hooks/useMessageBox";
import "./Login.css";

const boxMessages = {
    REG_SUCCESS: "Registered Successfully",
    FAILED: "Registration failed",
    FAILED_EMAIL: "Registration failed: \nEmail is invalid",
    FAILED_PASS: "Registration failed: \nPasswords do not match",
};

const Login = (props) => {
    const { user } = useUserState();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConifrm] = useState("");
    const [username, setUsername] = useState("");
    const [menuTab, toggleMenuTab] = useState(false);
    const [boxText, boxActive, setBoxText] = useMessageBox(5000, 1000);

    const redirectToHome = useCallback(() => {
        if (user && user?.isAuthenticated) navigate("/courses");
    }, [user.currentUser]);

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        if (notValidEmail()) {
            setBoxText(boxMessages.FAILED_EMAIL);
            return;
        }
        try {
            await login({ email: email, password: password });
            redirectToHome();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        if (notValidEmail()) {
            setBoxText(boxMessages.FAILED_EMAIL);
            return;
        }
        if (password !== passwordConfirm) {
            setBoxText(boxMessages.FAILED_PASS);
            return;
        }
        try {
            await register({
                username: username,
                email: email,
                password: password,
            }).then((data) => {
                if (data) setBoxText(boxMessages.REG_SUCCESS);
                else setBoxText(boxMessages.FAILED);
            });
            [setEmail, setPassword, setUsername, setPasswordConifrm].forEach(
                (f) => f("")
            );
            toggleMenuTab(false);
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
        <main className="login-page">
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <div
                className="login-html"
                style={menuTab ? { height: "670px" } : {}}
            >
                <input
                    id="tab-1"
                    type="radio"
                    name="tab"
                    className="sign-in"
                    checked={!menuTab}
                    onChange={() => toggleMenuTab(false)}
                />
                <label htmlFor="tab-1" className="tab">
                    Sign In
                </label>
                <input
                    id="tab-2"
                    type="radio"
                    name="tab"
                    className="sign-up"
                    checked={menuTab}
                    onChange={() => toggleMenuTab(true)}
                />
                <label htmlFor="tab-2" className="tab">
                    Sign Up
                </label>
                <div className="forms ">
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleSubmitLogin={handleSubmitLogin}
                    />
                    <RegisterForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        passwordConfirm={passwordConfirm}
                        setPasswordConifrm={setPasswordConifrm}
                        username={username}
                        setUsername={setUsername}
                        handleSubmitRegister={handleSubmitRegister}
                        toggleMenuTab={toggleMenuTab}
                    />
                </div>
            </div>
            <MessageBox
                className="message-box"
                boxActive={boxActive}
                boxText={boxText}
            />
        </main>
    );
};

export default Login;
