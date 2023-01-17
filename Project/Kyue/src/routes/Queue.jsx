import useUserState from "../hooks/useUserState";
import { useEffect } from "react";
import { AdminTools, AsyncDataWrapper, Navbar } from "../components";
import useQueueState from "../hooks/useQueueState";
import { useLoaderData } from "react-router-dom";
import QueueForm from "../components/QueueForm";

import "./Queue.css";
import { useState } from "react";
import { useCourseState } from "../hooks";
import { useCallback } from "react";
import addPolling from "../hoc/addPolling";

const Queue = () => {
    const { user } = useUserState();
    const { queue } = useQueueState();
    const { courses } = useCourseState();
    const courseId = useLoaderData();

    const [location, setLocation] = useState(null);
    const [comment, setComment] = useState(null);
    const [status, setStatus] = useState(null);
    const [inQueue, setInQueue] = useState(false);
    const [queueText, setQueueText] = useState("");

    const toggleStatus = () => {
        setStatus(!status);
    };

    const fetchQueue = useCallback(() => {
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
    }, []);
    const forceUpdate = addPolling(fetchQueue, 20000); // set to 3000

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
        forceUpdate();
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
        forceUpdate();
    };

    useEffect(() => {
        if(!courses?.courses) return
        const course = courses?.courses?.find((c) => c?.id === courseId);
        setQueueText(course?.course_description)
    }, [])

    const handleSetDescription = (text) => {
        if (!queue.isAdministrator) return;
        console.log("{courseId: courseId, description: text} :>> ", {
            courseId: courseId,
            description: text,
        });
        courses.setCourseDescription({ user: user?.currentUser, courseId: courseId, description: queueText });
    };

    return (
        <div style={{ position: "relative" }} className="queue-page">
            <Navbar username={user?.currentUser?.username} />
            <div className="queue-page-wrapper">
                <header className="queue-header">
                    <h1>{courseId || "Queue"}</h1>
                </header>
                {queue.isAdministrator ? (
                    <div className="queue-description-box">
                        <h4 className="description-box-header">
                            Queue Desciprtion
                        </h4>
                        <form
                            id="descform"
                            className="admin-description-box"
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log('e.target[0] :>> ', e.target);
                                setQueueText(e.target[0].textContent)
                                handleSetDescription(e.target[0].textContent);
                            }}
                        >
                            <textarea
                                className="admin-description-box"
                                defaultValue={queueText}
                                // onChange={(e) => setQueueText(e.target.textContent)}
                                // form="descform"
                            />
                            <button type="submit" title="Set new description">
                                Set new Description
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="queue-description-box">
                        <span>{queueText}</span>
                    </div>
                )}
                {queue.isAdministrator && (
                    <AdminTools
                        className="admin-tools-box"
                        adminList={
                            courses?.courses?.filter(
                                (c) => c?.id === courseId
                            )?.[0]?.administrators
                        }
                    />
                )}
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
                                            <td>
                                                {item?.status
                                                    ? "Active"
                                                    : "Waiting"}
                                            </td>
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
