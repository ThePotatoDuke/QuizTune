/*This page is not needed anymore*/
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormInputs) => {
    console.log("User Login Data: ", data);
    // Simulate login logic
    if (data.username === "admin" && data.password === "password") {
      navigate("/home");
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Spofued Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
