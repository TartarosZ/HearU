import { useState, useEffect } from "react";

function App() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", 
    });

    const data = await res.json();
    if (data.success) {
      setAuthenticated(true);
    } else {
      alert("Wrong password");
    }
  };

  useEffect(() => {
    fetch("/api/check", { credentials: "include" })
      .then(res => res.json())
      .then(data => setAuthenticated(data.authenticated));
  }, []);

  if (!authenticated) {
    return (
      <div className="p-6">
        <h1 className="text-xl mb-4">🔒 Please Enter Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>
      </div>
    );
  }

  return <div className="p-6">✅ You're in! Now the chat UI goes here...</div>;
}

export default App;
