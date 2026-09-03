import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050510" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "MovieVerse — Discover Movies",
    template: "%s | MovieVerse",
  },
  description:
    "Browse trending movies, get personalized recommendations, and manage your watchlist with MovieVerse.",
  applicationName: "MovieVerse",
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(
      /\/$/,
      ""
    )
  ),
  openGraph: {
    type: "website",
    siteName: "MovieVerse",
    title: "MovieVerse — Discover Movies",
    description:
      "Browse trending movies, get personalized recommendations, and manage your watchlist.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieVerse — Discover Movies",
    description:
      "Browse trending movies, get personalized recommendations, and manage your watchlist.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MovieVerse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mv_theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-mesh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
