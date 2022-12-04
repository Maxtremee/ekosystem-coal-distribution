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
      <Navbar fluid className="bg-white drop-shadow-lg dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {logo}
          <div className="md:hidden">{dropdown}</div>
        </div>
        <div className="flex gap-2">{navbarItems}</div>
      </Navbar>
      <main className="flex h-[calc(100vh-76px)] w-full overflow-y-auto bg-white dark:bg-gray-800 ">
        <div className="hidden md:block md:w-1/4">{sidebar}</div>
        <div className="flex w-full flex-col gap-4 p-4">{children}</div>
      </main>
    </div>
  );
}
