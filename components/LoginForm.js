import { useState } from "react";
import API from "../lib/axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/users/login", {
        username,
        password,
      });
      const userId = response.data.user_id; // バックエンドから user_id を取得
      localStorage.setItem("user_id", userId); // ローカルストレージに保存
      localStorage.setItem("username", username); // ユーザー名も保存
      setMessage("ログイン成功！");
    } catch (error) {
      setMessage("ログインに失敗しました。");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h3>ログイン</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">ログイン</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginForm;
