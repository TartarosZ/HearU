import { useState, useEffect } from "react";

const API_BASE = "https://openai-proxy-h5u4.onrender.com";

function App() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setAuthenticated(true);
  }, []);

  const handleLogin = async () => {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    try {
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("auth_token", data.token);
        setAuthenticated(true);
      } else {
        alert("Wrong password");
      }
    } catch (err) {
      alert("Login failed: response not valid JSON");
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem("auth_token");
    if (!token) return alert("Not authenticated");

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "" && line.startsWith("data:"));
        for (const line of lines) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            assistantReply += json.choices?.[0]?.delta?.content || "";
            setMessages(prev => {
              const temp = [...prev];
              temp[temp.length - 1] = { role: "assistant", content: assistantReply };
              return temp;
            });
          } catch (err) {
            console.error("Stream error:", err);
          }
        }
      }
    } catch (err) {
      alert("Error during chat request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6">
      <h2 className="text-2xl font-bold mb-4">Talk with Meow</h2>
      <div className="border p-4 bg-white rounded h-[60vh] overflow-y-scroll mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left text-blue-600"}>
            <p><strong>{msg.role === "user" ? "You" : "Agent"}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
