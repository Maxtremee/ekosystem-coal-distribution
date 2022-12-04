import { zodResolver } from "@hookform/resolvers/zod";
import { Label, Spinner, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import filterInvoicesListSchema, {
  FilterInvoicesListSchemaType,
} from "../../../schemas/filterInvoicesListSchema";
import { trpc } from "../../../utils/trpc";
import InvoicesTable from "./InvoicesTable";

export default function InvoicesList() {
  const form = useForm<FilterInvoicesListSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(filterInvoicesListSchema),
    defaultValues: {
      sortDir: "desc",
    },
  });
  const { register, watch } = form;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data, isLoading, error } = trpc.invoices.getFiltered.useQuery({
    ...watch(),
    search: debouncedSearch,
  });

  const searchChangeHandler = (
    event: FormEvent<HTMLInputElement> | undefined,
  ) => {
    setSearch(event?.currentTarget.value || "");
  };

  useDebounce(
    () => {
      setDebouncedSearch(search);
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
        <div>
          {isLoading && (
            <Spinner color="success" size="xl" />
          )}
        </div>
      </div>
      <InvoicesTable invoices={data || []} isError={!!error} />
    </FormProvider>
  );
}
