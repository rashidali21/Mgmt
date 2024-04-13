import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const registerUser = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/signup', {
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
  };

  return (
    <div
      style={{ minHeight: "100svh" }}
      className="flex items-center p-4 justify-center bg-gray-100"
    >

      <div className="w-1/4 bg-white rounded-lg shadow-lg p-4 flex justify-center flex-col items-center">
        <img
          src="/Logo.png"
          alt=""
          className="w-[150px] h-[50px] object-contain"
        />
        <h2 className="text-2xl font-bold text-center mb-2">
          Create a new account
        </h2>
        <p className="text-center mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700">
            Sign In
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
              className=" border border-black p-2 rounded-md items-center"
            />
            <label className="form-label text-sm text-gray-500">Email address</label>
            <input
              type="password"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              required
              style={{ width: "100%" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" border border-black p-2 rounded-md"
            />
            <label className="form-label text-sm text-gray-500">Password</label>


            <button
              type="submit"
              className={`submit bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md px-3 w-full`}
              onClick={registerUser}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}