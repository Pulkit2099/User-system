import axios from "axios";
import { useEffect, useState } from "react";
import { addUser, updateUser } from "./redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdateUser() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false); // New state for success message

  const users = useSelector((state) => state.users.users);

  useEffect(() => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [users, id]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();

    // ... Rest of the component code ...

    // If all validations pass, proceed with form submission
    axios
      .put("http://localhost:8080/update/" + id, { name, email, phone })
      .then((res) => {
        dispatch(updateUser({ id, name, email, phone }));
        setIsUpdateSuccess(true); // Set the success message state to true
        setTimeout(() => {
          setIsUpdateSuccess(false); // Hide the success message after a few seconds
        }, 3000); // Set the timeout to hide the success message after 3 seconds
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  // ... Rest of the component code ...

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <h2 className="card-title text-center mb-4">Update User</h2>
                {errorMessage && (
                  <div className="alert alert-danger mb-3">{errorMessage}</div>
                )}
                {isUpdateSuccess && (
                  <div className="alert alert-success mb-3">User updated successfully!</div>
                )}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="d-grid">
                  <button className="btn btn-success" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
