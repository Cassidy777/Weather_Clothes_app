import "../styles/globals.css"; // 統一された globals.css のインポート
import { UserProvider } from "../contexts/UserContext"; // contexts ディレクトリを指す

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
