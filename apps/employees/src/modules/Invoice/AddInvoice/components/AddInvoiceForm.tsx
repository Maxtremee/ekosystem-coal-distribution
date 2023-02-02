import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import frontendAddInvoiceSchema, {
  AddInvoiceSchemaType,
} from "../../../../schemas/invoiceSchema";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { InputError } from "@ekosystem/ui";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Decimal from "decimal.js";

export const calculateCoalLeft = (
  declaredNutCoal: Decimal | null | undefined,
  declaredEcoPeaCoal: Decimal | null | undefined,
  coalInInvoices: number | undefined,
) => {
  const nutCoal = new Decimal(declaredNutCoal || 0);
  const ecoPeaCoal = new Decimal(declaredEcoPeaCoal || 0);
  const inInvoices = new Decimal(coalInInvoices || 0);
  return nutCoal.plus(ecoPeaCoal).minus(inInvoices).toNumber();
};

export default function AddInvoiceForm() {
  const router = useRouter();
  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.invoices.add.useMutation();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<AddInvoiceSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddInvoiceSchema),
  });

  const onSubmit = (data: AddInvoiceSchemaType) =>
    mutate(
      {
        ...data,
        issueDate: dayjs(data.issueDate).set("hour", dayjs().hour()).toDate(),
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
        <Label htmlFor="invoiceId">Nazwa faktury</Label>
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
          placeholder="Dodatkowe informacje"
        />
        <InputError error={errors?.additionalInformation?.message} />
      </div>
      <InputError error={mutationError?.message} />
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Dodaj fakturę
      </Button>
    </form>
  );
}
