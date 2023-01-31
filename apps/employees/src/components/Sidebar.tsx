import {
  ArrowUpTrayIcon,
  DocumentChartBarIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <FlowbiteSidebar>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <Link href="/invoices" passHref>
            <FlowbiteSidebar.Item icon={DocumentChartBarIcon}>
              Faktury
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/stock-issues" passHref>
            <FlowbiteSidebar.Item icon={DocumentTextIcon}>
              Wydania towaru
            </FlowbiteSidebar.Item>
          </Link>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <Link href="/invoices/add" passHref>
            <FlowbiteSidebar.Item icon={DocumentPlusIcon}>
              Dodaj fakturę
            </FlowbiteSidebar.Item>
          </Link>
          <Link href="/import" passHref>
            <FlowbiteSidebar.Item icon={ArrowUpTrayIcon}>
              Importuj
            </FlowbiteSidebar.Item>
          </Link>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
