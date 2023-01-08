import {
  FilteringProvider,
  SelectPageSize,
  Text,
  useFiltering,
} from "@ekosystem/ui";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  Alert,
  Label,
  Pagination,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { ChangeEvent, useMemo } from "react";
import { StringParam } from "use-query-params";
import { trpc } from "../../../../utils/trpc";
import StockIssuesTable from "./StockIssuesTable";

const stockIssuesFilters = {
  distributionCenter: StringParam,
};
type StockIssuesFiltersType = typeof stockIssuesFilters;

export default function InvoicesList({ invoiceId }: { invoiceId?: string }) {
  const filtering = useFiltering<StockIssuesFiltersType>(stockIssuesFilters);
  const { values, register, getTotalPages, setPage, setValue, pageSize } =
    filtering;

  const {
    data: centers,
    isLoading: isLoadingCenters,
    isError: centersError,
  } = trpc.distributionCenters.getIdsAndNames.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const combinedCenters = useMemo(
    () => [
      { id: "all", name: "Wybierz skup" },
      ...(Array.isArray(centers) ? centers : []),
    ],
    [centers],
  );

  const {
    data: stockIssues,
    isLoading: isLoadingStockIssues,
    isError,
  } = trpc.stockIssues.getFiltered.useQuery({
    ...values,
    ...(!!invoiceId && {
      invoiceId: invoiceId,
    }),
  });

  const totalPages = getTotalPages(stockIssues?.total);

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Lista wydań towaru
      </Text>
      <FilteringProvider {...filtering}>
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="search">Szukaj</Label>
            <TextInput
              {...register("search")}
              id="search"
              className="w-full md:w-80"
              placeholder="Wpisz wybraną frazę"
            />
          </div>
          <div>
            <Label htmlFor="search">Wydane przez</Label>
            <Select
              id="distributionCenterId"
              className="w-full md:w-80"
              placeholder="Wybierz skup węgla"
              value={values.distributionCenter}
              disabled={isLoadingCenters || centersError}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setValue("distributionCenter", event.currentTarget.value)
              }
            >
              {combinedCenters.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </div>
          <SelectPageSize value={pageSize} setValue={setValue} />
        </div>
        <StockIssuesTable
          stockIssues={stockIssues?.stockIssues}
          isError={isError}
        />
        {isLoadingStockIssues && (
          <div>
            <Spinner color="success" size="xl" />
          </div>
        )}
        {stockIssues?.stockIssues && stockIssues.stockIssues?.length < 1 && (
          <Alert color="info" icon={InformationCircleIcon}>
            Brak wyników
          </Alert>
        )}
        <Pagination
          currentPage={values.page}
          onPageChange={setPage}
          totalPages={totalPages}
          previousLabel="Wstecz"
          nextLabel="Dalej"
        />
      </FilteringProvider>
    </div>
  );
}
