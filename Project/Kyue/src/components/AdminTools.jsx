import { useState } from "react";
import { ReactComponent as PlusCircleSvg } from "../assets/plusCircle.svg";
import "./AdminTools.css";

const AdminTools = ({ className, adminList }) => {
    const [showMenu, toggleOverlay] = useState(false);
    return (
        <div className={className}>
            <h4 className="description-box-header">Admin tools</h4>
            <div className="admin-search-bar">
                <input
                    className="add-administrator-input"
                    type="text"
                    placeholder="Email of new admin"
                ></input>
                <button className="add-administrator-button" type="submit">
                    <PlusCircleSvg />
                </button>
            </div>
            <button
                className="view-admins-button"
                type="submit"
                onClick={() => toggleOverlay(!showMenu)}
            >
                View Course Admins
            </button>
            <div
                className="admin-list-overlay"
                aria-checked={showMenu}
                onClick={() => toggleOverlay(false)}
            />
            <div
                id="admin-list-modal"
                aria-checked={showMenu}
                className="admin-list-modal"
            >
                {adminList === [] ? (
                    adminList.map((item) => {
                        <span>{item}</span>;
                    })
                ) : (
                    <span>No additional course admins</span>
                )}
            </div>
        </div>
    );
};

export default AdminTools;
