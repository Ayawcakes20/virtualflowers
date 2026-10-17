import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";
import { surprise } from "@/config/surprise";
import { motionPreferenceScript } from "@/lib/motion-preference";

export const metadata: Metadata = {
  title: surprise.title,
  description: "A tiny surprise. A whole lot of love. Made just for you.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, themeColor: "#F8F5FC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Only the head script's intentional data attribute differs before hydration.
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: motionPreferenceScript }} /></head><body>{children}</body></html>;
}
