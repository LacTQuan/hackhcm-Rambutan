import { AppProps } from "next/app";
import StoreProvider from "@/app/StoreProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <main>
        <Component {...pageProps} />
      </main>
    </StoreProvider>
  );
}
