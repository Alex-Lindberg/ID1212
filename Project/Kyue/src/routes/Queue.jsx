import useUserState from "../hooks/useUserState";
import useCourseState from "../hooks/useCourseState";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchQueue } from "../reducers/queueReducer";
import { LogoutButton, Navbar } from "../components";
import useQueueState from "../hooks/useQueueState";

import "./Queue.css";
import { useLoaderData } from "react-router-dom";

const Queue = () => {
    const { user } = useUserState();
    const { queue } = useQueueState();
    const courseId = useLoaderData();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dispatch || queue?.id) return;
        dispatch(fetchQueue(courseId));
    }, [dispatch]);

    useEffect(() => {}, [queue]);

    return !queue || !user ? (
        <div>Relax</div>
    ) : (
        <div className="queue-container">
            <Navbar username={user.currentUser.username} />
            <h1>Queue</h1>
            {queue.queue.map((item) => {
                return (<div className="course-item">
                    <div>
                        <span>{item?.username + " "}</span>
                        <span>{item?.location}</span>
                        <span>{item?.comment}</span>
                        <span>{item?.status}</span>
                    </div>
                </div>)
            })}
        </div>
    );
};

export default Queue;
