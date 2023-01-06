import { Text } from "@acme/ui";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Label, Pagination, Spinner, TextInput } from "flowbite-react";
import FilteringProvider from "../../../components/FilteringContext";
import useFiltering from "../../../hooks/useFiltering";
import { trpc } from "../../../utils/trpc";
import InvoiceTable from "./InvoiceTable";

export default function InvoiceList({
  applicationId,
}: {
  applicationId?: string;
}) {
  const filtering = useFiltering();
  const { values, register, setValue, getTotalPages } = filtering;

  const { data, isLoading, isError } = trpc.invoices.getFiltered.useQuery({
    ...values,
    ...(!!applicationId && {
      applicationId: applicationId,
    }),
  });

  const totalPages = getTotalPages(data?.total);

  return (
    <div className="flex flex-col gap-4">
      <Text>Lista faktur</Text>
      <FilteringProvider {...filtering}>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="search">Szukaj</Label>
            <TextInput
              {...register("search")}
              id="search"
              className="w-full md:w-80"
              placeholder="Wpisz wybraną frazę"
            />
          </div>
        </div>
        <InvoiceTable invoices={data?.invoices} isError={isError} />
        {isLoading && (
          <div>
            <Spinner color="success" size="xl" />
          </div>
        )}
        {data?.invoices && data?.invoices?.length < 1 && (
          <Alert color="info" icon={InformationCircleIcon}>
            Brak wyników
          </Alert>
        )}
        <Pagination
          currentPage={values.page}
          onPageChange={(page) => page < totalPages && setValue("page", page)}
          totalPages={totalPages}
          previousLabel="Wstecz"
          nextLabel="Dalej"
        />
      </FilteringProvider>
    </div>
  );
}
