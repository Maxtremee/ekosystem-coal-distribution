import {
  Text,
  FilteringProvider,
  useFiltering,
  SelectPageSize,
} from "@ekosystem/ui";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Label, Pagination, Spinner, TextInput } from "flowbite-react";
import { trpc } from "../../../../utils/trpc";
import ApplicationsTable from "./ApplicationsTable";
import DownloadApplicationsButton from "./DownloadApplicationsButton";

export default function ApplicationsList() {
  const filtering = useFiltering();
  const { values, register, getTotalPages, setPage, pageSize, setValue } =
    filtering;

  const { data, isLoading, isError } = trpc.applications.getFiltered.useQuery({
    ...values,
  });

  const totalPages = getTotalPages(data?.total);

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Lista wniosków
      </Text>
      <FilteringProvider {...filtering}>
        <div className="flex items-end gap-4">
          <div>
            <Label htmlFor="search">Szukaj</Label>
            <TextInput
              {...register("search")}
              id="search"
              className="w-full md:w-80"
              placeholder="Wpisz wybraną frazę"
            />
          </div>
          <SelectPageSize value={pageSize} setValue={setValue} />
          <DownloadApplicationsButton />
        </div>
        <ApplicationsTable
          applications={data?.applications}
          isError={isError}
        />
        {isLoading && (
          <div>
            <Spinner color="success" size="xl" />
          </div>
        )}
        {data?.applications && data?.applications?.length < 1 && (
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
