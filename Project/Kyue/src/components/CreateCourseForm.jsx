import "./CreateCourseForm.css";

const CreateCourseForm = ({
    setCourseId,
    setCourseTitle,
    list,
    showMenu,
    submitNewCourse,
}) => {
    return (
        <div className="create-course-form-wrapper">
            <form
                className="create-course-container"
                aria-checked={showMenu}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitNewCourse();
                }}
            >
                <label className="col-1 row-1" htmlFor="cl-id">
                    Course id
                </label>
                <input
                    id="cl-id"
                    className="cl-id col-1 row-2"
                    placeholder="e.g. ID1212"
                    onChange={(e) => setCourseId(e.target.value)}
                ></input>

                <label className="col-1 row-3">Title</label>
                <input
                    id="cl-title"
                    className="cl-title col-1 row-4"
                    placeholder="e.g. Datorteknik"
                    onChange={(e) => setCourseTitle(e.target.value)}
                ></input>

                <label
                    htmlFor="course-admin-list"
                    className="admin-list-label col-2"
                >
                    Additional administrators
                </label>
                <input
                    className="col-2"
                    type="text"
                    placeholder="Search user..."
                ></input>
                <button className="col-2" type="submit">
                    Add admin
                </button>
                <div id="course-admin-list" className="course-admin-list col-2">
                    {typeof list === Array && list !== [] ? (
                        list.map((item) => {
                            <span>{list}</span>;
                        })
                    ) : (
                        <span>No additional course admins</span>
                    )}
                </div>
                <button className="submit-create-course" type="submit">
                    Create Course
                </button>
            </form>
        </div>
    );
};

export default CreateCourseForm;
