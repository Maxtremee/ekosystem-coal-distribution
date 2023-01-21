import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "react-use";
import { useForm } from "react-hook-form";
import Decimal from "decimal.js";
import { InputError } from "@ekosystem/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Invoice } from "@ekosystem/db";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import frontendAddInvoiceSchema, {
  AddInvoiceSchemaType,
} from "../../../../schemas/invoiceSchema";
import { calculateCoalLeft } from "../../AddInvoice/components/AddInvoiceForm";

export default function UpdateInvoiceForm({
  application,
  invoice,
}: {
  application: RouterOutputs["invoices"]["checkIfApplicationExists"];
  invoice: Invoice;
}) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.invoices.update.useMutation();
  const [debounceInvoiceId, setDebouncedInvoiceId] = useState("");

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
      paidForCoal: new Decimal(invoice.paidForCoal).toNumber(),
      // @ts-ignore
      issueDate: dayjs(invoice?.issueDate).format("YYYY-MM-DD"),
      invoiceId: invoice?.invoiceId,
      additionalInformation: invoice?.additionalInformation || undefined,
    },
  });

  trpc.invoices.checkIfUnique.useQuery(
    { invoiceId: debounceInvoiceId },
    {
      enabled: !!debounceInvoiceId && !invoice,
      onSuccess: (data) => {
        if (data?.invoiceId !== invoice.invoiceId) {
          setError("invoiceId", {
            message: "Taki numer faktury już istnieje",
            type: "value",
          });
        }
      },
    },
  );

  const invoiceNameWatch = watch("invoiceId");
  useDebounce(
    () => {
      setDebouncedInvoiceId(invoiceNameWatch);
    },
    600,
    [invoiceNameWatch],
  );

  const declaredCoalLeft = useMemo(
    () =>
      calculateCoalLeft(
        application?.declaredNutCoal,
        application?.declaredEcoPeaCoal,
        application?.coalInInvoices,
      ) + Number(invoice.paidForCoal.toString()),
    [],
  );

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
        <Label htmlFor="invoiceId">Nazwa faktury </Label>
        <TextInput
          {...register("invoiceId")}
          id="invoiceId"
          placeholder="Numer faktury"
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

      <div>
        <Label htmlFor="paidForCoal">Opłacona ilość węgla [kg]</Label>
        <TextInput
          {...register("paidForCoal", {
            max: declaredCoalLeft,
          })}
          id="paidForCoal"
          placeholder="Ilość węgla"
          type="number"
          helperText={`Pozostało do odebrania z wniosku: ${declaredCoalLeft} kg`}
          max={declaredCoalLeft}
        />
        <InputError error={errors?.paidForCoal?.message} />
      </div>
      <div>
        <Label htmlFor="issueDate">Dodatkowe informacje (opcjonalnie)</Label>
        <Textarea
          {...register("additionalInformation")}
          id="additionalInformation"
          placeholder="Data wystawienia"
        />
        <InputError error={errors?.additionalInformation?.message} />
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
