import type { Metadata, Viewport } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "MOWAY Enterprise",
  description: "Premium Fintech Dashboard",
};

// ЭТОТ БЛОК РЕШАЕТ ПРОБЛЕМУ МАСШТАБА НА IPHONE
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F4F5F7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}