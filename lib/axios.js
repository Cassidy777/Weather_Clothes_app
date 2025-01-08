import axios from "axios";

// 環境変数からバックエンドの URL を取得し、デフォルト値を設定
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: BACKEND_API_URL, // 環境変数が設定されていれば使用、なければデフォルト
  withCredentials: true, // クッキー送信が必要な場合
});

export default API;
