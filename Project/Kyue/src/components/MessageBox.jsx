import "./MessageBox.css";

const MessageBox = ({ boxText, boxActive }) => {
    return (
        <div className="message-box-container">
            <div className="message-box-wrapper" aria-checked={boxActive}>
                <span className="box-text">{boxText}</span>
            </div>
        </div>
    );
};

export default MessageBox;
