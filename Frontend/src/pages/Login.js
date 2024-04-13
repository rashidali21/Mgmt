import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import img from "../assets/img.png"

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const logInUser = (e) => {
    e.preventDefault();
    if (email.length === 0) {
      alert("Email has left Blank!");
    }
    else if (password.length === 0) {
      alert("password has left Blank!");
    }
    else {
      axios.post('http://127.0.0.1:5000/login', {
        email: email,
        password: password
      })
        .then(function (response) {
          console.log(response);
          navigate("/");
        })
        .catch(function (error) {
          console.log(error, 'error');
          if (error.response.status === 401) {
            alert("Invalid credentials");
          }
        });
    }
  }

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="flex items-center justify-center flex-col flex-grow bg-gray-100 p-4"
    >
      <div className="w-1/4 bg-white rounded-lg shadow-lg p-4 flex justify-center flex-col items-center">
        <img
          src="/Logo.png"
          alt=""
          className="w-[150px] h-[50px] object-contain logo"
        />
        <h2 className="text-2xl font-bold text-center mb-2 form-title">
          Login to your account
        </h2>
        <p className="text-center mb-6">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-blue-700">
            Sign Up
          </Link>
        </p>
        <div className=" mx-4 px-4 flex flex-col items-center">
          <form className="space-y-2">
            <input
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              required
              style={{ width: "100%" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" border border-black rounded-md p-2"
            />
            <label className="form-label text-sm text-gray-500">Email address</label>
            <input
              type="password"
              id="outlined-basic-2"
              label="Password"
              variant="outlined"
              required
              style={{ width: "100%" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" border border-black rounded-md p-2"
            />
            <label className="form-label text-sm text-gray-500">Password</label>


            <button
              type="submit"
              className={`submit bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md px-3 w-full`}
              onClick={logInUser}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );

}
