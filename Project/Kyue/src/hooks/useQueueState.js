import { useDispatch, useSelector } from "react-redux";
import { dequeue, enqueue, queueActions, fetchQueue, updateQueueItem  } from "../reducers/queueReducer";

const useQueueState = () => {
    const queueState = useSelector((state) => state.queueState);
    const dispatch = useDispatch();

    return {
        queue: {
            get queue() {
                return queueState.queue
            },
            get isAdministrator() {
                return queueState.isAdministrator
            },
            get error() {
                return queueState.error !== "" ? queueState.error : ""
            },
            setQueue: (queue) => {
                dispatch(queueActions.setQueue(queue))
            },
            fetchQueue: (params) => {
                dispatch(fetchQueue(params)).un
            },
            checkIfAdministrator: (params) => {
                dispatch(queueActions.checkIfAdministrator(params))
            },
            enqueue: (params) => {
                return dispatch(enqueue(params))
            },
            dequeue: (params) => {
                return dispatch(dequeue(params))
            },
            updateQueueItem: (params) => {
                return dispatch(updateQueueItem(params))
            }
        },
    };
};

export default useQueueState;
