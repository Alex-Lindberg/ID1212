import "./QueueForm.css";
import "../routes/Queue.css";

const QueueForm = (props) => {
    return (
        <form className={props.className}>
            <label htmlFor="location-input">Location</label>
            <input id="location-input" className="location-input" onChange={(e) => {
                props.setLocation(e.target.value)
            }} />

            <label htmlFor="comment-input">Comment</label>
            <input id="comment-input" className="comment-input" onChange={(e) => {
                props.setComment(e.target.value)
            }} />
            <div className="queue-button-wrapper">
                <input
                    type="submit"
                    id="submit-input"
                    className="submit-input"
                    value={!props.inQueue ? "Enqueue" : "Dequeue"}
                    onClick={(e) => {
                        e.preventDefault();
                        props.handleSubmit();
                    }}
                />
                <input
                    type="submit"
                    id="submit-input"
                    className="submit-input"
                    value={!props.status ? "Receiving Help" : "Set Waiting"}
                    onClick={(e) => {
                        e.preventDefault();
                        props.toggleStatus();
                    }}
                />
            </div>
        </form>
    );
};

export default QueueForm;
