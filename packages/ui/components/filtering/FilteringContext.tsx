import { useContext } from "react";
import { ReactNode } from "react";
import { createContext } from "react";
import { QueryParamConfigMap } from "use-query-params";
import { UseFilteringReturn } from "../../hooks/useFiltering";

const FilteringContext = createContext({});

export const useFilteringContext = <
  T extends QueryParamConfigMap = QueryParamConfigMap,
>() => {
  const context = useContext(FilteringContext);
  return { ...context } as UseFilteringReturn<T>;
};

export const FilteringProvider = <
  T extends QueryParamConfigMap = QueryParamConfigMap,
>({
  children,
  ...rest
}: { children: ReactNode } & UseFilteringReturn<T>) => {
  return (
    <FilteringContext.Provider value={{ ...rest }}>
      {children}
    </FilteringContext.Provider>
  );
};

export default FilteringProvider;
