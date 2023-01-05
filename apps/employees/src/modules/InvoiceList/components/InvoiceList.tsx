import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Label, Pagination, Spinner, TextInput } from "flowbite-react";
import { StringParam, withDefault } from "use-query-params";
import FilteringProvider from "../../../components/FilteringContext";
import useFiltering from "../../../hooks/useFiltering";
import { trpc } from "../../../utils/trpc";
import InvoiceTable from "./InvoiceTable";

const invoiceAdditionalParams = {
  sortBy: withDefault(StringParam, "issueDate"),
};

export type InvoiceAdditionalParamsType = typeof invoiceAdditionalParams;

export default function InvoiceList({
  applicationId,
}: {
  applicationId: string | undefined;
}) {
  const filtering = useFiltering<InvoiceAdditionalParamsType>(
    invoiceAdditionalParams,
  );
  const { values, register, pageSize, setValue } = filtering;
  const { page } = values;
  console.log(values)
  const { data, isLoading, error } =
    trpc.invoices.getFilteredWithApplicationId.useQuery(
      {
        ...values,
        applicationId: applicationId as string,
      },
      {
        enabled: !!applicationId,
      },
    );

  const totalPages = (data?.total || 0) / pageSize;

  return (
    <FilteringProvider<InvoiceAdditionalParamsType> {...filtering}>
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
      <InvoiceTable invoices={data?.invoices} isError={!!error} />
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
        currentPage={page}
        onPageChange={(page) => page < totalPages && setValue("page", page)}
        totalPages={totalPages}
        previousLabel="Wstecz"
        nextLabel="Dalej"
      />
    </FilteringProvider>
  );
}
