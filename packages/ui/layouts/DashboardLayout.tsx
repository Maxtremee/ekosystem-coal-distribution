import { ReactNode } from "react";
import { Navbar } from "flowbite-react";

export type DashboardLayoutProps = {
  children: ReactNode;
  navbarItems: ReactNode;
  logo: ReactNode;
};

export default function DashboardLayout({
  children,
  navbarItems,
  logo,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen">
      <Navbar fluid className="bg-white drop-shadow-lg dark:bg-gray-800">
        <div className="flex gap-2">{logo}</div>
        <div className="flex gap-2">{navbarItems}</div>
      </Navbar>
      <main className="flex h-[calc(100vh-76px)] w-full flex-col items-center justify-start overflow-y-auto bg-white p-4 dark:bg-gray-800 ">
        <div className="w-full md:w-3/4 lg:w-1/2">{children}</div>
      </main>
    </div>
  );
}
