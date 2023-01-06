import { DashboardLayout, LandingPageLayout } from "@ekosystem/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Dropdown from "./Dropdown";
import Logo from "./Logo";
import NavbarItems from "./NavbarItems";
import NoSSR from "./NoSSR";
import Sidebar from "./Sidebar";

export default function RenderLayout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  if (pathname.startsWith("/register") || pathname === "/") {
    return (
      <LandingPageLayout
        logo={
          <div className="h-40">
            <Logo />
          </div>
        }
      >
        {children}
      </LandingPageLayout>
    );
  }

  return (
    <DashboardLayout
      navbarItems={<NavbarItems />}
      sidebar={
        <NoSSR>
          <Sidebar />
        </NoSSR>
      }
      dropdown={<Dropdown />}
      logo={
        <div className="h-14">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      }
    >
      {children}
    </DashboardLayout>
  );
}
