import useUserState from "../hooks/useUserState";
import { useEffect } from "react";
import { AsyncDataWrapper, Navbar } from "../components";
import useQueueState from "../hooks/useQueueState";
import { useLoaderData } from "react-router-dom";
import QueueForm from "../components/QueueForm";

import "./Queue.css";
import { useState } from "react";
import { useCourseState } from "../hooks";

const Queue = () => {
    const { user } = useUserState();
    const { queue } = useQueueState();
    const { courses } = useCourseState();
    const courseId = useLoaderData();

    const [location, setLocation] = useState(null);
    const [comment, setComment] = useState(null);
    const [status, setStatus] = useState(null);
    const [inQueue, setInQueue] = useState(false);

    const toggleStatus = () => {
        setStatus(!status);
    };

    const handleSubmit = () => {
        if (!courseId || !user?.currentUser) return;
        if (!inQueue && location !== "") {
            queue.enqueue({
                user: user?.currentUser,
                courseId: courseId,
                location: location,
                comment: comment,
            });
            setInQueue(!inQueue);
        } else if (inQueue) {
            queue.dequeue({ user: user.currentUser, courseId: courseId });
            setInQueue(!inQueue);
        }
    };

    const handleRecieveHelp = (item) => {
        if (item === null) {
            setStatus(!status);
        }
        queue.updateQueueItem({
            courseId: courseId,
            user: user.currentUser,
            userToUpdate: item === null ? user.currentUser : item.userId,
            location: location !== "" ? location : null,
            comment: comment !== "" ? comment : null,
            status: item === null ? status : !item.status,
        });
    };

    useEffect(() => {
        if (courseId && !user?.currentUser) return;
        (async () =>
            queue.fetchQueue({
                courseId: courseId,
                user: user.currentUser,
            }))().then(() => {
            const course = courses?.courses?.find((c) => c?.id === courseId);
            queue.checkIfAdministrator({
                user: user?.currentUser,
                course: course,
            });
        });
    }, [courseId, !user?.currentUser]);

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
                <QueueForm
                    className="form-container"
                    inQueue={inQueue}
                    status={status}
                    setLocation={setLocation}
                    setComment={setComment}
                    toggleStatus={toggleStatus}
                    handleSubmit={handleSubmit}
                    handleRecieveHelp={(e) => handleRecieveHelp(null)}
                />
                <table className="queue-container">
                    <thead>
                        <tr className="course-item">
                            <th>#</th>
                            <th>Username</th>
                            <th>Location</th>
                            <th>Comment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AsyncDataWrapper
                            data={queue?.queue}
                            error={queue?.error}
                        >
                            {queue?.queue ? (
                                queue?.queue.map((item, i) => {
                                    return (
                                        <tr
                                            key={i}
                                            className="course-item"
                                            aria-checked={item?.status}
                                            onClick={(e) => {
                                                if (queue.isAdministrator) {
                                                    handleRecieveHelp({
                                                        userId: item.user_id,
                                                        status: item?.status,
                                                    });
                                                }
                                            }}
                                        >
                                            <td>{i + 1}</td>
                                            <td>{item?.username + " "}</td>
                                            <td>{item?.location}</td>
                                            <td>{item?.comment}</td>
                                            <td>{item?.status ? 'Active' : 'Waiting'}</td>
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
