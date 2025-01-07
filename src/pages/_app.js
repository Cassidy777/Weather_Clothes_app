import "../styles/globals.css"; // グローバルスタイルのインポート
import { UserProvider } from "../contexts/UserContext"; // contexts ディレクトリを指す

function MyApp({ Component, pageProps }) {
  console.log("UserProvider is wrapping:", UserContext);
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
