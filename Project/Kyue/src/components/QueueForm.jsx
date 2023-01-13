import "./QueueForm.css";
import "../routes/Queue.css";

const QueueForm = ({ className }) => {
    return (
        <form className={className}>
            <label htmlFor="location-input">Location</label>
            <input id="location-input" className="location-input"></input>

            <label htmlFor="comment-input">Comment</label>
            <input id="comment-input" className="comment-input"></input>

            {/* <label htmlFor="status-input"></label>
                <input id="status-input"></input> */}
            <div className="queue-button-wrapper">
                <input
                    type="submit"
                    id="submit-input"
                    className="submit-input"
                    value="Enqueue"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log("Submitted");
                    }}
                />
                <input
                    type="submit"
                    id="submit-input"
                    className="submit-input"
                    value="Recieving Help"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log("Submitted");
                    }}
                />
            </div>
        </form>
    );
};

export default QueueForm;
