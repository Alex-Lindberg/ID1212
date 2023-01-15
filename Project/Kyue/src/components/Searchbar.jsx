import "./Searchbar.css";
import { ReactComponent as SearchSvg } from "../assets/search.svg";
import { useState } from "react";
import { useEffect } from "react";

const Searchbar = ({ list, setFilteredList }) => {
    return (
        <div className="search-bar">
            <input
                id="searchQueryInput"
                type="text"
                className="searchQueryInput"
                placeholder="Search"
                onChange={(e) => {
                    const lowerCased = e.target.value.toLowerCase();
                    const filteredList = list.filter(
                        (item) =>
                            item.id.toLowerCase().includes(lowerCased) ||
                            item.title.toLowerCase().includes(lowerCased)
                    );
                    setFilteredList(filteredList);
                }}
            />
            <span
                id="searchQuerySubmit"
                type="submit"
                className="searchQuerySubmit"
            >
                <SearchSvg />
            </span>
        </div>
    );
};

export default Searchbar;
