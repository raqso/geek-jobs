import "../styles/globals.css";
import "../components/App.css";
import "../components/SearchBox.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
