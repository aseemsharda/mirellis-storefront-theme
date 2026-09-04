import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://studio.mirellis.in"),
  title: "Mirellis Studio",
  description: "Private contributor and editorial review workspace for Mirellis.",
  icons: {
    icon: [
      { url: "/brand/mirellis-favicon-32.png?v=20260822", sizes: "32x32", type: "image/png" },
      { url: "/brand/mirellis-favicon-16.png?v=20260822", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-icon.png?v=20260822",
    shortcut: "/brand/mirellis-favicon-32.png?v=20260822",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
