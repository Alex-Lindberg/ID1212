import "./CreateCourseForm.css"

const CreateCourseForm = ({setCourseId, setCourseTitle, list}) => {

    return (
            <form className="create-course-container">
                <label>Course id</label>
                <input placeholder="e.g. ID1212"  onChange={(e) => setCourseId(e.target.value)}></input>

                <label>Title</label>
                <input placeholder="e.g. Datorteknik" onChange={(e) => setCourseTitle(e.target.value)}></input>

                {/* <label>Additional administrators</label>
                <div className="course-admin-list">
                    {typeof list === Array && list !== [] ? list.map((item) => {
                        <span>{list}</span>
                    }) : <span>No additional course admins</span>}
                </div> */}
                <button type="submit">Create Course</button>
            </form>
    );
}

export default CreateCourseForm;