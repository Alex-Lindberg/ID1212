import useUserState from "../hooks/useUserState";
import { useDispatch, useStore } from "react-redux";
import { useEffect } from "react";
import { AsyncDataWrapper, Navbar } from "../components";
import useQueueState from "../hooks/useQueueState";
import { useLoaderData } from "react-router-dom";
import QueueForm from "../components/QueueForm";

import "./Queue.css";

const Queue = () => {
    const { user } = useUserState();
    const { queue } = useQueueState();
    const courseId = useLoaderData();

    useEffect(() => {
        if (courseId && !user?.currentUser) return;
        queue.fetchQueue({ courseId: courseId, user: user.currentUser });
    }, [courseId, !user?.currentUser]);

    useEffect(() => {}, [queue?.queue]);

    return (
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
                <table className="queue-container">
                    <thead>
                        <tr className="course-item">
                            <th>#</th>
                            <th>Username</th>
                            <th> Location</th>
                            <th>Comment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AsyncDataWrapper
                            data={queue?.queue}
                            error={queue?.error}
                        >
                            {queue?.queue && queue?.queue !== [] ? (
                                queue?.queue.map((item, i) => {
                                    return (
                                        <tr
                                            key={i}
                                            className="course-item"
                                            aria-checked={
                                                item?.status !== "Waiting"
                                            }
                                        >
                                            <td>{i + 1}</td>
                                            <td>{item?.username + " "}</td>
                                            <td>{item?.location}</td>
                                            <td>{item?.comment}</td>
                                            <td>{item?.status}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <div className="no-one-in-queue-msg">
                                    No one is currently in the queue.
                                </div>
                            )}
                        </AsyncDataWrapper>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Queue;
