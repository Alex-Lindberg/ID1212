import { redirect } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import "./errorPage.css";

export default function ErrorPage() {
    const error = useRouteError();
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
                <div className="text-wrapper" >
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
                <button className="home-button" onClick={()=>(window.location.pathname = "/")}>{"> Home"}</button>
                </div>
            </section>
        </main>
    );
}
