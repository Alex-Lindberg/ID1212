import { LoginForm } from "../components";
import "./Login.css";

const Login = (props) => {
    return (
        <section>
            <h1>Kyue</h1>
            <div className="login-wrapper">
                <div className="login-content">
                    <LoginForm />
                    <hr />
                </div>
            </div>
        </section>
    );
};

export default Login;
