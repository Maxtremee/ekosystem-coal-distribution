import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Label, Pagination, Spinner, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import filterApplicationsListSchema, {
  FilterApplicationsListSchemaType,
} from "../../../schemas/filterApplicationsListSchema";
import { trpc } from "../../../utils/trpc";
import ApplicationsTable from "./ApplicationsTable";

const pageSize = 20;

export default function ApplicationsList() {
  const form = useForm<FilterApplicationsListSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(filterApplicationsListSchema),
    defaultValues: {
      sortDir: "desc",
    },
  });
  const { register, watch } = form;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data, isLoading, error } = trpc.applications.getFiltered.useQuery({
    ...watch(),
    search: debouncedSearch,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = (data?.total || 0) / pageSize;

  const searchChangeHandler = (
    event: FormEvent<HTMLInputElement> | undefined,
  ) => {
    setSearch(event?.currentTarget.value || "");
  };

  useDebounce(
    () => {
      setDebouncedSearch(search);
      setPage(1);
    },
    600,
    [search],
  );

  return (
    <FormProvider {...form}>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="search">Szukaj</Label>
          <TextInput
            {...register("search")}
            id="search"
            className="w-full md:w-80"
            placeholder="Wpisz wybraną frazę"
            value={search}
            onChange={searchChangeHandler}
          />
        </div>
      </div>
      <ApplicationsTable applications={data?.applications} isError={!!error} />
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
        currentPage={page}
        onPageChange={(page) => page < totalPages && setPage(page)}
        totalPages={totalPages}
        previousLabel="Wstecz"
        nextLabel="Dalej"
      />
    </FormProvider>
  );
}
