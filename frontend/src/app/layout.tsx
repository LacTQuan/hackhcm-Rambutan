import { Navbar } from "@/components";
import "./globals.css";
import styles from "./layout.module.css";
import StoreProvider from "./StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <header className={styles.header}>
            <Navbar />
          </header>
          <main className={styles.main}>
            <StoreProvider>
              {children}
            </StoreProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
