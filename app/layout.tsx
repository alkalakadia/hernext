import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HerNext — Navigate what's next",
  description:
    "HerNext turns a woman's healthcare transition into a personalized, evidence-backed action plan: what decisions are ahead, what to ask your provider, and what to do next.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
