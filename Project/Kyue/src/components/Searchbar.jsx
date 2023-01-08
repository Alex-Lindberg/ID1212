import './Searchbar.css'
import { ReactComponent as SearchSvg } from "../assets/search.svg";


const Searchbar = () => {
    return (
        <div className="search-bar">
            <input
                id="searchQueryInput"
                type="text"
                className="searchQueryInput"
                placeholder="Search"
                value=""
            />
            <button
                id="searchQuerySubmit"
                type="submit"
                className="searchQuerySubmit"
            >
                <SearchSvg />
            </button>
        </div>
    );
};

export default Searchbar;
