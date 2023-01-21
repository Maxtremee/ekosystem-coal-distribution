import { useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "react-use";
import { useForm } from "react-hook-form";
import Decimal from "decimal.js";
import { InputError } from "@ekosystem/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Invoice } from "@ekosystem/db";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import frontendAddInvoiceSchema, {
  AddInvoiceSchemaType,
} from "../../../../schemas/invoiceSchema";

export default function UpdateInvoiceForm({
  application,
  invoice,
}: {
  application: RouterOutputs["invoices"]["checkIfApplicationExists"];
  invoice: Invoice;
}) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.invoices.update.useMutation();
  const [debounceInvoiceName, setDebouncedInvoiceName] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm<AddInvoiceSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddInvoiceSchema),
    defaultValues: {
      declaredEcoPeaCoal: invoice?.declaredEcoPeaCoal
        ? new Decimal(invoice.declaredEcoPeaCoal).toNumber()
        : undefined,
      declaredNutCoal: invoice?.declaredNutCoal
        ? new Decimal(invoice.declaredNutCoal).toNumber()
        : undefined,
      issueDate: dayjs(invoice?.issueDate).format("YYYY-MM-DD"),
      invoiceId: invoice?.name,
    },
  });

  trpc.invoices.checkIfUnique.useQuery(
    { invoiceId: debounceInvoiceName },
    {
      enabled: !!debounceInvoiceName && !invoice,
      onSuccess: (data) => {
        if (data?.name !== invoice.name) {
          setError("name", {
            message: "Taki numer faktury już istnieje",
            type: "value",
          });
        }
      },
    },
  );

  const invoiceNameWatch = watch("name");
  useDebounce(
    () => {
      setDebouncedInvoiceName(invoiceNameWatch);
    },
    600,
    [invoiceNameWatch],
  );

  const nutCoalLeft = application?.declaredNutCoal
    ? new Decimal(application?.declaredNutCoal)
        .minus(application.nutCoalInInvoices)
        .add(new Decimal(invoice?.declaredNutCoal || 0))
        .toNumber()
    : 0;

  const ecoPeaCoalLeft = application?.declaredEcoPeaCoal
    ? new Decimal(application?.declaredEcoPeaCoal)
        .minus(application.ecoPeaCoalInInvoices)
        .add(new Decimal(invoice?.declaredEcoPeaCoal || 0))
        .toNumber()
    : 0;

  const onSubmit = (data: AddInvoiceSchemaType) =>
    mutate(
      {
        ...data,
        id: invoice.id,
        issueDate: dayjs(data.issueDate)
          .set("hour", dayjs(invoice.issueDate).hour())
          .toDate(),
      },
      {
        onSuccess: (res) => {
          router.replace(`/invoices/${res.id}`);
        },
      },
    );

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="invoiceName">Nazwa faktury </Label>
        <TextInput
          {...register("name")}
          id="invoiceName"
          placeholder="Nazwa faktury"
        />
        <InputError error={errors?.invoiceId?.message} />
      </div>
      <div>
        <Label htmlFor="issueDate">Data wystawienia</Label>
        <TextInput
          {...register("issueDate")}
          id="issueDate"
          placeholder="Data wystawienia"
          type="date"
        />
        <InputError error={errors?.issueDate?.message} />
      </div>

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Label htmlFor="declaredNutCoal">Ilość węgla - orzech [Kg]</Label>
          <TextInput
            {...register("declaredNutCoal", {
              max: nutCoalLeft,
            })}
            id="declaredNutCoal"
            placeholder="Ilość węgla"
            type="number"
            helperText={`Pozostało do odebrania z wniosku: ${nutCoalLeft} kg`}
            max={nutCoalLeft}
          />
          <InputError error={errors?.declaredNutCoal?.message} />
        </div>
        <div className="w-full">
          <Label htmlFor="declaredEcoPeaCoal">Ilość węgla - groszek [Kg]</Label>
          <TextInput
            {...register("declaredEcoPeaCoal", {
              max: ecoPeaCoalLeft,
            })}
            id="declaredEcoPeaCoal"
            placeholder="Ilość węgla"
            type="number"
            helperText={`Pozostało do odebrania z wniosku: ${ecoPeaCoalLeft} kg`}
            max={ecoPeaCoalLeft}
          />
          <InputError error={errors?.declaredEcoPeaCoal?.message} />
        </div>
      </div>
      <Button
        color="success"
        type="submit"
        disabled={isLoading || !isValid || !application}
      >
        {isLoading && <Spinner color="success" className="mr-2" />}
        Aktualizuj fakturę
      </Button>
    </form>
  );
}
