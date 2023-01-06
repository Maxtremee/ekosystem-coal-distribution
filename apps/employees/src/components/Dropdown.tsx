import { Dropdown as FlowbiteDropdown } from "flowbite-react";
import Link from "next/link";

export default function Dropdown() {
  return (
    <FlowbiteDropdown label="Opcje">
      <Link href="/applications">
        <FlowbiteDropdown.Item>Lista wniosków</FlowbiteDropdown.Item>
      </Link>
      <Link href="/invoices" passHref>
        <FlowbiteDropdown.Item>Lista faktur</FlowbiteDropdown.Item>
      </Link>
      <Link href="/stock-issues" passHref>
        <FlowbiteDropdown.Item>Lista wydań towaru</FlowbiteDropdown.Item>
      </Link>
      <Link href="/applications/add">
        <FlowbiteDropdown.Item>Dodaj wniosek</FlowbiteDropdown.Item>
      </Link>
    </FlowbiteDropdown>
  );
}
