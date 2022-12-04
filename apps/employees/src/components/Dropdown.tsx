import { Dropdown as FlowbiteDropdown } from "flowbite-react";
import Link from "next/link";

export default function Dropdown() {
  return (
    <FlowbiteDropdown label="Opcje">
      <Link href="/invoices">
        <FlowbiteDropdown.Item>Lista faktur</FlowbiteDropdown.Item>
      </Link>
      <Link href="/invoices/add">
        <FlowbiteDropdown.Item>Dodaj fakturę</FlowbiteDropdown.Item>
      </Link>
    </FlowbiteDropdown>
  );
}
