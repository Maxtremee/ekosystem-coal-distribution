import { ChangeEvent } from "react";
import { Label, Select } from "flowbite-react";
import { defaultFilters, UseFilteringReturn } from "../../hooks/useFiltering";

const pageSizeOptions = [
  {
    name: Math.ceil(defaultFilters.pageSize / 2),
    value: Math.ceil(defaultFilters.pageSize / 2),
  },
  {
    name: defaultFilters.pageSize,
    value: defaultFilters.pageSize,
  },
  {
    name: defaultFilters.pageSize * 2,
    value: defaultFilters.pageSize * 2,
  },
  {
    name: defaultFilters.pageSize * 3,
    value: defaultFilters.pageSize * 3,
  },
];

export function SelectPageSize({
  setValue,
  value,
}: {
  setValue: (filter: "pageSize", value: string) => void;
  value: UseFilteringReturn["pageSize"];
}) {
  return (
    <div>
      <Label htmlFor="pageSize">Na stronie</Label>
      <Select
        id="pageSize"
        className="w-full md:w-32"
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          setValue("pageSize", event.currentTarget.value)
        }
      >
        {pageSizeOptions.map(({ value, name }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </Select>
    </div>
  );
}
