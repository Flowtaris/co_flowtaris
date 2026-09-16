import "./global.css";
import type { Metadata } from "next";
import { ClientLayout } from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "Flowtaris | Judgment, Evidence, Leverage",
  description: "Engineering complex systems for companies where reliability, judgment, and execution matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
