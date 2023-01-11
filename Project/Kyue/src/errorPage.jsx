import { useRouteError } from "react-router-dom";
import { loadUser } from "./api";
import "./errorPage.css";
import useUserState from "./hooks/useUserState";

export default function ErrorPage() {
    const error = useRouteError();
    const { user } = useUserState();

    return (
        <main className="error-page">
            <div className="background">
                <div className="shape" />
            </div>
            <section className="content-wrapper">
                <div className="err-code-wrapper">
                    <span className="err-code">
                        {error.status || "Code: ?"}
                    </span>
                </div>
                <div className="text-wrapper">
                    <div className="err-status">
                        <span className="err-status">
                            {error.statusText || "Text: ?"}
                        </span>
                    </div>
                    <div className="err-data-wrapper">
                        <span className="err-data">
                            {error.data || "Unknown"}
                        </span>
                    </div>
                    <button
                        className="home-button"
                        onClick={() => {
                            if (!loadUser(user)) window.location.pathname = "/";
                            else window.location.pathname = "/login";
                        }}
                    >
                        {"> Home"}
                    </button>
                </div>
            </section>
        </main>
    );
}
