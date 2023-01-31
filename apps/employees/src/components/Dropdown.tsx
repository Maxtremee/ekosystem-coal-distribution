import { Dropdown as FlowbiteDropdown } from "flowbite-react";
import Link from "next/link";

export default function Dropdown() {
  return (
    <FlowbiteDropdown label="Opcje">
      <Link href="/invoices" passHref>
        <FlowbiteDropdown.Item>Faktury</FlowbiteDropdown.Item>
      </Link>
      <Link href="/stock-issues" passHref>
        <FlowbiteDropdown.Item>Wydania towaru</FlowbiteDropdown.Item>
      </Link>
      <Link href="/applications/add" passHref>
        <FlowbiteDropdown.Item>Dodaj wniosek</FlowbiteDropdown.Item>
      </Link>
      <Link href="/import" passHref>
        <FlowbiteDropdown.Item>Importuj</FlowbiteDropdown.Item>
      </Link>
      <Link href="/api/auth/logout" passHref>
        <FlowbiteDropdown.Item>Wyloguj się</FlowbiteDropdown.Item>
      </Link>
    </FlowbiteDropdown>
  );
}
