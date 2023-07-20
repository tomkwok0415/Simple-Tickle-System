import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";

function Login (props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {

    e.preventDefault();
    fetch("http://127.0.0.1:3001/api/login-user", {
      method: "POST",
      redirect: 'follow',
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          alert("Login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("admin", data.adminFlag);
          if (window.localStorage.getItem("token")) {
            if (window.localStorage.getItem("admin") == "true") {
              navigate("/Preference");
            } else {
              navigate("/Dashboard");
            }
          } else {
            navigate("/");
          }
        } else {
          alert("Login failed, please enter your credentials again.");
          document.getElementById('login_form').reset();
        }
      });
  }
  return (
    <div className="Auth-form-container">
      <form className="form-control Auth-form" id="login_form" onSubmit={handleSubmit}>
      <div className="Auth-form-title">Login to<br></br> Simple Ticket System</div>
        <div className="mb-3">
          <label className="Auth-form-content">Username</label>
          <input
            className="form-control"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="Auth-form-content">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;