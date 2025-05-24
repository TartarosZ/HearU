import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        setError(null);
        onLoginSuccess();
      } else {
        setError('Wrong Password');
      }
    } catch (e) {
      setError('Login Failed');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Please entry the password</h2>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 w-full mb-2"
        placeholder="password"
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}
