import useUserState from "../hooks/useUserState";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchQueue } from "../reducers/queueReducer";
import { AsyncDataWrapper, Navbar } from "../components";
import useQueueState from "../hooks/useQueueState";
import { useLoaderData } from "react-router-dom";
import QueueForm from "../components/QueueForm";

import "./Queue.css";

const Queue = () => {
    const { user } = useUserState();
    const { queue } = useQueueState();
    const courseId = useLoaderData();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dispatch || queue?.id) return;
        dispatch(fetchQueue(courseId));
    }, [dispatch]);

    return (
        <AsyncDataWrapper data={queue?.queue} error={queue?.error}>
        <div style={{ position: "relative" }} className="queue-page">
            <Navbar username={user?.currentUser?.username} />
            <div className="queue-page-wrapper">
                <header className="queue-header">
                    <h1>{courseId || "Queue"}</h1>
                </header>
                <div className="queue-description-box">
                    <span>
                        Heres some message text, it's gonna repeat for a bit
                        since we're emulating instructions. Heres some message
                        text, it's gonna repeat for a bit since we're emulating
                        instructions. Heres some message text, it's gonna repeat
                        for a bit since we're emulating instructions.
                    </span>
                </div>
                <div className="line-break" />
                <QueueForm className="form-container" />
                <div className="queue-container">
                    {queue.queue !== [] ? (
                        queue?.queue.map((item) => {
                            return (
                                <div className="course-item" aria-checked={item?.status !== "Waiting"}>
                                    <div>
                                        <span>{item?.username + " "}</span>
                                        <span>{item?.location}</span>
                                        <span>{item?.comment}</span>
                                        <span>{item?.status}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-one-in-queue-msg">
                            No one is currently in the queue.
                        </div>
                    )}
                </div>
            </div>
        </div>
        </AsyncDataWrapper>
    );
};

export default Queue;
