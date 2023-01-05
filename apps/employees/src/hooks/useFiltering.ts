import { FormEvent, useState } from "react";
import { useDebounce } from "react-use";
import {
  useQueryParams,
  NumberParam,
  StringParam,
  withDefault,
  createEnumParam,
  QueryParamConfigMap,
} from "use-query-params";

const defaultFilters = {
  sortDir: "desc",
  pageSize: 20,
  page: 1,
  search: "",
};

type FilteringValues<T extends QueryParamConfigMap> = {
  skip: number;
  take: number;
  sortDir: "asc" | "desc";
  page: number;
  search: string;
} & Record<keyof T, string>;

export type UseFilteringReturn<T extends QueryParamConfigMap> = {
  setValue: (
    filter: keyof typeof defaultFilters | keyof T,
    value: unknown,
  ) => void;
  register: (filter: keyof typeof defaultFilters | keyof T) => {
    onChange: (ev: FormEvent<HTMLInputElement> | undefined) => void;
    value: string | number | undefined;
    name: string;
  };
  pageSize: number;
  values: FilteringValues<T>;
};

export const useFiltering = <T extends QueryParamConfigMap>(
  filters: QueryParamConfigMap,
): UseFilteringReturn<T> => {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, defaultFilters.page),
    pageSize: withDefault(NumberParam, defaultFilters.pageSize),
    search: withDefault(StringParam, defaultFilters.search),
    sortDir: withDefault(
      createEnumParam(["asc", "desc"]),
      defaultFilters.sortDir,
    ),
    ...filters,
  });

  const [search, setSearch] = useState(query?.search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useDebounce(
    () => {
      setDebouncedSearch(search);
      setQuery({ page: 1 });
    },
    600,
    [search],
  );

  const setValue = (filter: keyof typeof query | keyof T, value: unknown) => {
    if (filter === "search") {
      setSearch(value as string);
    } else {
      setQuery({
        page: 1,
        [filter]: value,
      });
    }
  };

  const register = (filter: keyof typeof query | keyof T) => {
    const onChange = (ev: FormEvent<HTMLInputElement> | undefined) => {
      setValue(filter, ev?.currentTarget?.value);
    };
    return {
      onChange,
      value: filter === "search" ? search : query[filter as keyof typeof query],
      name: filter as string,
    };
  };

  return {
    setValue,
    register,
    pageSize: query.pageSize,
    values: {
      ...query,
      sortDir: query?.sortDir === "asc" ? "asc" : "desc",
      search: debouncedSearch,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    } as FilteringValues<T>,
  };
};
export default useFiltering;
