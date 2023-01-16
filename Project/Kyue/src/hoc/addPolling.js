import { useCallback, useEffect, useRef } from "react";

const addPolling = (func, interval) => {
    
    // Number of executions in parallel
    // const runningCount = useRef(0);
    const timeout = useRef();
    const mountedRef = useRef(false);

    const next = useCallback(
        (handler) => {
            // if (mountedRef.current && runningCount.current === 0) {
            if (mountedRef.current) {
                timeout.current = window.setTimeout(handler, interval);
            }
        },
        [interval]
    );

    const run = useCallback(async () => {
        // runningCount.current += 1;
        const result = await func();
        // runningCount.current -= 1;

        next(run);

        return result;
    }, [func, next]);

    useEffect(() => {
        mountedRef.current = true;
        run();

        return () => {
            mountedRef.current = false;
            window.clearTimeout(timeout.current);
        };
    }, [run]);

    const flush = useCallback(() => {
        window.clearTimeout(timeout.current);
        return run();
    }, [run]);

    return flush;
};

export default addPolling;
