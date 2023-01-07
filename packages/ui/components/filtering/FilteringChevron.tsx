import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { UseFilteringReturn } from "../../hooks/useFiltering";
import { useFilteringContext } from "./FilteringContext";

export function FilteringChevron<T extends string | number | symbol>({
  values,
  id,
}: {
  values?: UseFilteringReturn["values"];
  id: T;
}) {
  let query: UseFilteringReturn["values"] | undefined = values;
  if (!values) {
    try {
      const { values: filteringValues } = useFilteringContext();
      query = filteringValues;
    } catch {
      return null;
    }
  }
  if (query === undefined) {
    throw new Error(
      "FilteringChevron: you didn't either pass values nor this component is under any FilteringContext!",
    );
  }
  if (query.sortBy === id) {
    return (
      <ChevronUpIcon
        width={20}
        height={20}
        className={`ml-1 transition-transform ${
          query.sortDir === "asc" ? "rotate-0" : "rotate-180"
        }`}
      />
    );
  }
  return null;
}
