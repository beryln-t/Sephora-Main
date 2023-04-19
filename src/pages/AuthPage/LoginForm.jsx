import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginTry, setLoginTry] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginTry),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Network error");
      }
      localStorage.setItem("token", JSON.stringify(data.token));
      const decoded = getUser();
      const Name = JSON.parse(window.atob(data.token.split(".")[1]));
      console.log(Name.customer.name);
      console.log(Name.customer.email);
      setUser(decoded);
      if (Name.customer.role === "CUSTOMER") {
        navigate("/");
      } else if (Name.customer.role === "OPSADMIN") {
        navigate("/productpage");
      } else if (Name.customer.role === "HRADMIN") {
        navigate("/");
      }

      console.log(decoded);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setLoginTry({
      ...loginTry,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <fieldset>
            <legend>Login</legend>
            <label>
              Email:
              <input
                name="email"
                value={loginTry.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Password:{" "}
              <input
                name="password"
                value={loginTry.password}
                onChange={handleChange}
                type="password"
              />
            </label>
            <button>Login</button>
            <Link to="/forgetpassword">
              <button>Forget Password</button>
            </Link>
          </fieldset>
        </form>
      </div>
      {error ? <p>&nbsp;{error}</p> : null}
    </div>
  );
}
