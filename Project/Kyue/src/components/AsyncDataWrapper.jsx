const checkData = (data) => {
    if (typeof data === Array) {
        return data.some((d) => !d);
    }
    return !data;
};

const checkError = (error) => {
    if (typeof error === Array) return error.some((err) => err);
    return error;
};

const AsyncDataWrapper = ({ data, error, children }) => {
    if (checkData(data)) {
        return <div className="async-loading">Loading...</div>;
    }
    if (checkError(error)) {
        return <div className="async-error">Something went wrong</div>;
    }
    return children;
};

export default AsyncDataWrapper;
