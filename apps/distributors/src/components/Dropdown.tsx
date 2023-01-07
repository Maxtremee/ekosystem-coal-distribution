import { Dropdown as FlowbiteDropdown } from "flowbite-react";
import Link from "next/link";

export default function Dropdown() {
  return (
    <FlowbiteDropdown label="Opcje">
      <Link href="/stock-issues" passHref>
        <FlowbiteDropdown.Item>Wydania towaru</FlowbiteDropdown.Item>
      </Link>
      <Link href="/stock-issues/add">
        <FlowbiteDropdown.Item>Wydaj towar</FlowbiteDropdown.Item>
      </Link>
      <Link href="/api/auth/logout">
        <FlowbiteDropdown.Item>Wyloguj się</FlowbiteDropdown.Item>
      </Link>
    </FlowbiteDropdown>
  );
}
