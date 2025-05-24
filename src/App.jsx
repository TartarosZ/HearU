import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';

function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch('/api/check', {
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) setAuthed(true);
        else setAuthed(false);
      })
      .catch(() => setAuthed(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">🧠 心理陪伴 AI</h1>
        {authed ? <ChatWindow /> : <Login onLoginSuccess={() => setAuthed(true)} />}
      </div>
    </div>
  );
}

export default App;
