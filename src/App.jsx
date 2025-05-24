import { useState, useEffect } from "react";

const API_BASE = "https://openai-proxy-h5u4.onrender.com"; 

function App() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async () => {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", 
    });

    try {
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
      } else {
        alert("Wrong password");
      }
    } catch (err) {
      alert("Login failed: response not valid JSON");
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/check`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch((err) => console.error("Check failed", err));
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white">
        <div className="bg-white shadow-md p-8 rounded-xl">
          <h1 className="text-2xl font-bold mb-4">Enter Access Password</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded mr-2"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold">✅ Authenticated</h2>
      <p className="text-gray-600 mt-2">Now you can add your AI agent UI here.</p>
    </div>
  );
}

export default App;
