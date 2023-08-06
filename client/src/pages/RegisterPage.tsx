import React, { useState } from "react";
import httpClient from "../httpClient";
import { Link } from "react-router-dom";
import { api } from "../config";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const [mess, setMess] = useState<string>('')

  const registerUser = async () => {
    try {
      const resp = await httpClient.post(`${api}/register`, {
        email,
        username,
        password,
      });

      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 409) {
        setMess('This email is already in use.')
      } else {
        setMess('This username is already in use.')
      }
    }
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Create an account</h2>
  
      <form className="mx-auto max-w-lg rounded-lg border">
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <div>
            <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
            <input name="email" value={email} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Username</label>
            <input name="username" value={username} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" onChange={(e) => setUsername(e.target.value)} />
          </div>
  
          <div>
            <label htmlFor="password" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
            <input name="password" type="password" value={password} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="text-red-500">
          {mess}
        </div>
  
          <button type="button" onClick={() => registerUser()} className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Create</button>
        </div>
  
        <div className="flex items-center justify-center bg-gray-100 p-4">
          <p className="text-center text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Register</Link></p>
        </div>
      </form>
    </div>
  </div>
  );
};

export default RegisterPage;
