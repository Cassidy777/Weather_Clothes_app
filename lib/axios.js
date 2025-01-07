import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // バックエンドのURL
  withCredentials: true, // クッキー送信が必要な場合
});

export default API;
