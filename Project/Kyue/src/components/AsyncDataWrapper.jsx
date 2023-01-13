const checkData = (data) => {
    if (data === null || data === undefined)
        return true
    if (typeof data === Array && data !== []) {
        return data.some((d) => !d);
    }
    return !data;
};

const checkError = (error) => {
    if (typeof error === Array) return error.some((err) => err);
    return error;
};

const AsyncDataWrapper = ({ data, error, children }) => {
    if (checkError(error)) {
        return <div className="async-error">Something went wrong</div>;
    }
    if (checkData(data)) {
        return <div className="async-loading">Loading...</div>;
    }
    return children;
};

export default AsyncDataWrapper;
