import { ReactNode } from "react";
import { Navbar } from "flowbite-react";

export type DashboardLayoutProps = {
  children: ReactNode;
  navbarItems: ReactNode;
  logo: ReactNode;
  sidebar: ReactNode;
  dropdown: ReactNode;
};

export default function DashboardLayout({
  children,
  navbarItems,
  logo,
  sidebar,
  dropdown,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen">
      <Navbar
        fluid
        className="w-full  bg-white drop-shadow-lg dark:bg-gray-800"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div>{logo}</div>
          <div className="md:hidden">{dropdown}</div>
          <div className="hidden gap-2 md:flex">{navbarItems}</div>
        </div>
      </Navbar>
      <main className="flex h-[calc(100vh-76px)] w-full bg-white dark:bg-gray-800 ">
        <div className="hidden md:block md:w-1/4 md:overflow-y-auto">
          {sidebar}
        </div>
        <div className="flex w-full flex-col gap-4 overflow-y-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
