import { LoginForm } from "../components";
import "./Login.css";

const Login = (props) => {
    return (
        <main className="login-page">
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <LoginForm />
        </main>
    );
};

export default Login;
