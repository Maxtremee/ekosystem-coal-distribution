import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Decimal from "decimal.js";
import { InputError } from "@ekosystem/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Invoice } from "@ekosystem/db";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { trpc } from "../../../../utils/trpc";
import frontendAddInvoiceSchema, {
  AddInvoiceSchemaType,
} from "../../../../schemas/invoiceSchema";

export default function UpdateInvoiceForm({ invoice }: { invoice: Invoice }) {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<AddInvoiceSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddInvoiceSchema),
    defaultValues: {
      amount: new Decimal(invoice.amount).toNumber(),
      // @ts-ignore
      issueDate: dayjs(invoice.issueDate).format("YYYY-MM-DD"),
      invoiceId: invoice.invoiceId,
      applicationId: invoice?.applicationId || undefined,
      additionalInformation: invoice?.additionalInformation || undefined,
    },
  });

  const router = useRouter();
  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.invoices.update.useMutation();

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
        <Label htmlFor="invoiceId">Numer faktury </Label>
        <TextInput
          {...register("invoiceId")}
          id="invoiceId"
          placeholder="Numer faktury"
        />
        <InputError error={errors?.invoiceId?.message} />
      </div>
      <div>
        <Label htmlFor="applicationId">Numer wniosku (opcjonalnie)</Label>
        <TextInput
          {...register("applicationId")}
          id="applicationId"
          placeholder="Numer wniosku"
        />
        <InputError error={errors?.applicationId?.message} />
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
        <Label htmlFor="amount">Opłacona ilość węgla [kg]</Label>
        <TextInput
          {...register("amount")}
          id="amount"
          placeholder="Ilość węgla"
          type="number"
        />
        <InputError error={errors?.amount?.message} />
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
      <InputError error={mutationError?.message} />
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Aktualizuj fakturę
      </Button>
    </form>
  );
}
