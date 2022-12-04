import { ListBulletIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <FlowbiteSidebar>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <Link href="/invoices" passHref>
            <FlowbiteSidebar.Item icon={ListBulletIcon}>
              Lista faktur
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/invoices/add" passHref>
            <FlowbiteSidebar.Item icon={PlusIcon}>
              Dodaj fakturę
            </FlowbiteSidebar.Item>
          </Link>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
