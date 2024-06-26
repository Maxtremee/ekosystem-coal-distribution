import {
  FilteringProvider,
  SelectDate,
  SelectPageSize,
  Text,
  useFiltering,
} from "@ekosystem/ui";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Label, Pagination, Spinner, TextInput } from "flowbite-react";
import { trpc } from "../../../utils/trpc";
import StockIssuesTable from "./StockIssuesTable";

export default function StockIssuesList() {
  const filtering = useFiltering();
  const { values, register, getTotalPages, setPage, pageSize, setValue } =
    filtering;

  //@ts-ignore
  const { data, isLoading, isError } = trpc.stockIssues.getFiltered.useQuery({
    ...values,
  });

  const totalPages = getTotalPages(data?.total);

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Lista wydań towaru
      </Text>
      <FilteringProvider {...filtering}>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <Label htmlFor="search">Szukaj</Label>
            <TextInput
              {...register("search")}
              id="search"
              className="w-full md:w-80"
              placeholder="Wpisz wybraną frazę"
            />
          </div>
          <SelectDate
            registerAfter={register("after")}
            registerBefore={register("before")}
          />
          <SelectPageSize value={pageSize} setValue={setValue} />
        </div>
        <StockIssuesTable stockIssues={data?.stockIssues} isError={isError} />
        {isLoading && (
          <div>
            <Spinner color="success" size="xl" />
          </div>
        )}
        {data?.stockIssues && data.stockIssues?.length < 1 && (
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
