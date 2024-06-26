import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";

export type LandingPageLayoutProps = {
  children: ReactNode;
  logo: ReactNode;
};

export default function LandingPageLayout({
  children,
  logo,
}: LandingPageLayoutProps) {
  return (
    <ThemeProvider>
      <div className="h-screen">
        <main className="flex h-full flex-col items-center justify-center gap-4 bg-white dark:bg-gray-800">
          <div className="h-12">{logo}</div>
          <div>{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
