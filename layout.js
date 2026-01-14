import "./globals.css";

export const metadata = {
  title: "Genesys INSPIRE - The Game",
  description: "FY27 INSPIRE Sales Simulation - AI-Powered Team Challenge",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
