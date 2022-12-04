import { DashboardLayout, LandingPageLayout } from "@acme/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Logo from "./Logo";
import NavbarItems from "./NavbarItems";

export default function RenderLayout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  if (pathname === "/") {
    return (
      <LandingPageLayout
        children={children}
        logo={
          <div className="h-40">
            <Logo />
          </div>
        }
      />
    );
  }

  return (
    <DashboardLayout
      children={children}
      navbarItems={<NavbarItems />}
      logo={
        <div className="h-14">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
      }
    />
  );
}
