import { useState } from "react";

function Login({ setToken }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    setToken("loggedin");
    localStorage.setItem("token", "loggedin");

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-blue-900">

      <div className="bg-white p-10 rounded-xl shadow-xl w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Insurance Eligibility AI
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;