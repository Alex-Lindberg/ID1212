import useUserState from "../hooks/useUserState";
import useCourseState from "../hooks/useCourseState";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchQueue } from "../reducers/queueReducer";
import { LogoutButton, Navbar } from "../components";
import useQueueState from "../hooks/useQueueState";

import "./Queue.css"

const Queue = ({ id, title, status }) => {
    const { user } = useUserState();
    const { queue } = useQueueState();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!dispatch || queue?.id) return;
        dispatch(fetchQueue(id));
    }, [dispatch]);

    return !queue || !user ? (
        <div>Relax</div>
    ) : (
        <div className="queue-container">
            <Navbar username={user.currentUser.username} />
            <h1>Queue</h1>
            <div className="course-item">
                <div>
                    <span>{queue?.id + " "}</span>
                    <span>{queue?.title}</span>
                </div>
                <div>{queue?.status}</div>
            </div>
        </div>
    );
};

export default Queue;
