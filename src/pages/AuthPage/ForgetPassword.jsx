import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
      });
      const [error, setError] = useState(null);
    
      const disable = state.password !== state.confirm;
      const existingCustomer = async (userData) => {
        const response = await fetch(`/api/customer/forget`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      
        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.error || "Reset password unsuccessful.");
        }
      
        return data;
      };
      
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await existingCustomer(state);
          setState({
            name:"",
            email: "",
            password: "",
            confirm: "",
          })
          navigate("/login");
        } catch (error) {
          setError(error.message);
          console.error(`Error: ${error.message}`)
        }
      };
    
      const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.value,
        });
      };
    
      return (
        <div>
          <div className="form-container">
            <form autoComplete="off" onSubmit={handleSubmit}>
              <fieldset>
                <legend>Reset Password</legend>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={state.name}
                onChange={handleChange}
                required
              />
              &nbsp;
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={state.email}
                onChange={handleChange}
                required
              />
              &nbsp;
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={state.password}
                onChange={handleChange}
                required
              />
              &nbsp;
              <label>Confirm</label>
              <input
                type="password"
                name="confirm"
                value={state.confirm}
                onChange={handleChange}
                required
              />
              &nbsp;
              <button type="submit" disabled={disable}>
                RESET PASSWORD
              </button>
              </fieldset>
            </form>
          </div>
          {error ? <p>&nbsp;{error}</p> : null}
        </div>
      );
}

export default ForgetPassword;