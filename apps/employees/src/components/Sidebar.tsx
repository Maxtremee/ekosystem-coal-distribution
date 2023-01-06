import { ListBulletIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <FlowbiteSidebar>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <Link href="/applications" passHref>
            <FlowbiteSidebar.Item icon={ListBulletIcon}>
              Lista wniosków
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/invoices" passHref>
            <FlowbiteSidebar.Item icon={ListBulletIcon}>
              Lista faktur
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/stock-issues" passHref>
            <FlowbiteSidebar.Item icon={ListBulletIcon}>
              Lista wydań towaru
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/applications/add" passHref>
            <FlowbiteSidebar.Item icon={PlusIcon}>
              Dodaj wniosek
            </FlowbiteSidebar.Item>
          </Link>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
