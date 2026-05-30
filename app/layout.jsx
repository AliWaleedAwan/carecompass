import "./globals.css";
import { StoreProvider } from "../lib/store.js";
import Nav from "../components/Nav.jsx";

export const metadata = {
  title: "CareCompass — SDG 3 Triage Agent",
  description:
    "An AI health-triage agent that routes patients to the right level of care. Aligned with SDG 3: Good Health & Well-being.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <Nav />
          <main className="mx-auto max-w-5xl px-5 pb-24 pt-6">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
