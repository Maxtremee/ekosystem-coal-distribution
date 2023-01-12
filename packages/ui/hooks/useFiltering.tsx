import { useCallback } from "react";
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

export const defaultFilters = {
  sortDir: "desc",
  pageSize: 20,
  page: 1,
  search: "",
  sortBy: "createdAt",
};

type FilteringValues<T extends QueryParamConfigMap = QueryParamConfigMap> = {
  skip: number;
  take: number;
  sortDir: "asc" | "desc";
  sortBy: string;
  page: number;
  search: string;
} & Record<keyof T, string>;

export type UseFilteringReturn<
  T extends QueryParamConfigMap = QueryParamConfigMap,
> = {
  pageSize: number;
  values: FilteringValues<T>;
  getTotalPages: (length?: number) => number;
  onHeaderClick: <T extends string | number | symbol>() => (id: T) => void;
  setPage: (page: number) => void;
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

export const useFiltering = <
  T extends QueryParamConfigMap = QueryParamConfigMap,
>(
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
  const [search, setSearch] = useState(query?.search || defaultFilters.search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [resultsLength, setResultsLength] = useState(0);

  useDebounce(
    () => {
      if (debouncedSearch !== search) {
        setDebouncedSearch(search);
        setQuery({
          page: 1,
        });
      }
    },
    600,
    [search, debouncedSearch],
  );

  const setValue = useCallback(
    (filter: keyof typeof query | keyof T, value: unknown) => {
      if (filter === "search") {
        setSearch(value as string);
      } else {
        setQuery({
          page: 1,
          [filter]: value,
        });
      }
    },
    [setSearch, setQuery],
  );

  const register = (filter: keyof typeof query | keyof T) => ({
    value: filter === "search" ? search : query[filter as keyof typeof query],
    name: filter as string,
    onChange: (ev: FormEvent<HTMLInputElement> | undefined) => {
      setValue(filter, ev?.currentTarget?.value);
    },
  });

  const getTotalPages = useCallback(
    (length?: number) => {
      if (length && resultsLength !== length) {
        setResultsLength(length);
      }
      if (resultsLength > 1) {
        return Math.ceil(resultsLength / query.pageSize);
      }
      return 1;
    },
    [resultsLength, setResultsLength, query.pageSize],
  );

  const onHeaderClick = useCallback(
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
      },
    [query.sortBy, query.sortDir, setQuery],
  );

  const setPage = useCallback(
    (page: number) => {
      console.log(query.page !== page);
      if (query.page !== page) {
        setQuery({
          page,
        });
      }
    },
    [query.page, setQuery],
  );

  return {
    setValue,
    register,
    getTotalPages,
    onHeaderClick,
    setPage,
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
