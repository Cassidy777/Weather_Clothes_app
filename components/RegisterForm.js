import { useState } from "react";
import API from "../lib/axios";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // FormData オブジェクトを作成
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await API.post("/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // サーバーのレスポンスメッセージを表示
      if (response.status === 200) {
        setMessage("登録に成功しました！");
      } else {
        setMessage("登録に失敗しました。");
      }
    } catch (error) {
      console.error("登録エラー:", error);
  
      // サーバーからのエラーメッセージを取得して表示
      if (error.response) {
        setMessage(`登録に失敗しました: ${error.response.data.detail}`);
      } else {
        setMessage("登録に失敗しました。ネットワークエラーの可能性があります。");
      }
    }
  };

  return (
    <div>
      <h2>ユーザー登録</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">登録</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RegisterForm;
