import { useState, useEffect } from "react";

const usePromise = (promise) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        setData(null);
        setError(null);
        if (promise) promise.then(setData).catch(setError);
    }, [promise]);
    return [data, error];
};

export default usePromise;
