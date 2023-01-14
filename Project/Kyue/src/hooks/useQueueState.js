import { useDispatch, useSelector } from "react-redux";
import { queueActions, fetchQueue } from "../reducers/queueReducer";

const useQueueState = () => {
    const queueState = useSelector((state) => state.queueState);
    const dispatch = useDispatch();

    return {
        queue: {
            get queue() {
                return queueState.queue
            },
            get error() {
                return queueState.error !== "" ? queueState.error : ""
            },
            setQueue: (queue) => {
                dispatch(queueActions.setQueue(queue))
            },
            fetchQueue: (params) => {
                dispatch(fetchQueue(params))
            }
        },
    };
};

export default useQueueState;
