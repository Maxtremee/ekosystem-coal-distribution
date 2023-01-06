import { DocumentPlusIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <FlowbiteSidebar>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <Link href="/stock-issues" passHref>
            <FlowbiteSidebar.Item icon={DocumentTextIcon}>
              Wydania towaru
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/stock-issues/add" passHref>
            <FlowbiteSidebar.Item icon={DocumentPlusIcon}>
              Wydaj towar
            </FlowbiteSidebar.Item>
          </Link>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
