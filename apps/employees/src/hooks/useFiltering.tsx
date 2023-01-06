import { ChevronUpIcon } from "@heroicons/react/24/solid";
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
  sortBy: "createdAt",
};

type FilteringValues<T extends QueryParamConfigMap> = {
  skip: number;
  take: number;
  sortDir: "asc" | "desc";
  sortBy: string;
  page: number;
  search: string;
} & Record<keyof T, string>;

export type UseFilteringReturn<T extends QueryParamConfigMap> = {
  pageSize: number;
  values: FilteringValues<T>;
  getTotalPages: (length?: number) => number;
  onHeaderClick: <T extends string | number | symbol>() => (id: T) => void;
  showChevron: <T extends string | number | symbol>() => (
    id: T,
  ) => null | JSX.Element;
  setValue: (
    filter: keyof typeof defaultFilters | keyof T,
    value: unknown,
  ) => void;
  register: (filter: keyof typeof defaultFilters | keyof T) => {
    onChange: (ev: FormEvent<HTMLInputElement> | undefined) => void;
    value: string | number | undefined;
    name: string;
  };
};

export const useFiltering = <T extends QueryParamConfigMap>(
  filters?: QueryParamConfigMap,
): UseFilteringReturn<T> => {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, defaultFilters.page),
    pageSize: withDefault(NumberParam, defaultFilters.pageSize),
    search: withDefault(StringParam, defaultFilters.search),
    sortBy: withDefault(StringParam, "createdAt"),
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

  const getTotalPages = (length?: number) => {
    if (length) {
      return length / query.pageSize;
    }
    return 0;
  };

  const onHeaderClick =
    <T extends string | number | symbol>() =>
    (id: T) => {
      if (query.sortBy !== id) {
        setQuery({
          sortBy: id as string,
          sortDir: "desc",
        });
      } else {
        setQuery({
          sortDir: query.sortDir === "desc" ? "asc" : "desc",
        });
      }
    };

  const showChevron =
    <T extends string | number | symbol>() =>
    // eslint-disable-next-line react/display-name
    (id: T) => {
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
    };

  return {
    setValue,
    register,
    getTotalPages,
    onHeaderClick,
    showChevron,
    pageSize: query.pageSize,
    values: {
      ...query,
      search: debouncedSearch,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    } as FilteringValues<T>,
  };
};

export default useFiltering;
