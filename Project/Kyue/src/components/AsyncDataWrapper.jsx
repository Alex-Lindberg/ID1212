const AsyncDataWrapper = ({ data, error, children }) => {
    if (!data) {
        return <div className="async-loading">Loading...</div>;
    }
    if (error) {
        return <div className="async-error">Gick ej att hämta div</div>;
    }
    
    return children;
};

export default AsyncDataWrapper;
