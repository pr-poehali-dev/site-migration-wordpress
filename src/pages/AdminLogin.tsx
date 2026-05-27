import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_URL = "https://functions.poehali.dev/702f1c91-73d4-425c-b71e-b2f5560c31b1";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = isSetup ? "/setup" : "/login";
    const res = await fetch(AUTH_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok && data.token) {
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_username", data.username);
      navigate("/admin");
    } else {
      setError(data.error || "Ошибка входа");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-white mb-1">АвтоМеханики</div>
          <div className="text-gray-400 text-sm">Панель управления</div>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-4 border border-gray-800">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Логин</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Входим..." : isSetup ? "Создать аккаунт" : "Войти"}
          </button>
          <button
            type="button"
            onClick={() => { setIsSetup(!isSetup); setError(""); }}
            className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            {isSetup ? "Уже есть аккаунт? Войти" : "Первый вход? Создать аккаунт"}
          </button>
        </form>
      </div>
    </div>
  );
}
