import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store"; // Adjust import based on your store setup
// Import your registration action here
// import { registerUser } from '../store/userSlice'; // Example import

export default function Register() {
  // Get form data
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access user and error from Redux store
  const user = useSelector((state: RootState) => state.user.user);
  const error = useSelector((state: RootState) => state.user.error);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Example of dispatching a registration action
    // await dispatch(registerUser({ fullName, email, password }));
    
    setLoading(false);
  };

  // Redirect user if logged in
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to homepage or any other page
    }
  }, [user, navigate]);

  return (
    <div className="d-flex container-sm col-sm-3">
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <img
            className="mb-4"
            src="/docs/5.3/assets/brand/bootstrap-logo.svg"
            alt="Bootstrap logo"
            width="72"
            height="57"
          />
          <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control mb-2"
              id="floatingName"
              placeholder="John Smith"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} // Bind full name state
            />
            <label htmlFor="floatingName">Full Names</label>
          </div>

          <div className="form-floating">
            <input
              type="email"
              className="form-control mb-2"
              id="floatingEmail"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Bind email state
            />
            <label htmlFor="floatingEmail">Email address</label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control mb-2"
              id="floatingPassword"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Bind password state
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control mb-2"
              id="floatingConfirmPassword"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Bind confirm password state
            />
            <label htmlFor="floatingConfirmPassword">Confirm Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          {error && <p className="text-danger">{error}</p>} {/* Display error message */}
          <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
        </form>
      </main>
    </div>
  );
}
