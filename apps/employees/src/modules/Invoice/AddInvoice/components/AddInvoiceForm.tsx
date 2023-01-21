import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import frontendAddInvoiceSchema, {
  AddInvoiceSchemaType,
} from "../../../../schemas/invoiceSchema";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { InputError } from "@ekosystem/ui";
import { useMemo } from "react";
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

export default function AddInvoiceForm({
  application,
}: {
  application: Exclude<
    RouterOutputs["invoices"]["checkIfApplicationExists"],
    null
  >;
}) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.invoices.add.useMutation();

  const {
    setError,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<AddInvoiceSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddInvoiceSchema),
  });

  const declaredCoalLeft = useMemo(
    () =>
      calculateCoalLeft(
        application.declaredNutCoal,
        application.declaredEcoPeaCoal,
        application.coalInInvoices,
      ),
    [],
  );

  const onSubmit = (data: AddInvoiceSchemaType) =>
    mutate(
      {
        ...data,
        issueDate: dayjs(data.issueDate).set("hour", dayjs().hour()).toDate(),
        applicationId: application.id as string,
      },
      {
        onSuccess: (res) => {
          router.replace(`/invoices/${res.id}`);
        },
        onError: (err) => {
          setError("invoiceId", {
            message: err?.message,
          });
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
          placeholder="Dodatkowe informacje"
        />
        <InputError error={errors?.additionalInformation?.message} />
      </div>
      <Button
        color="success"
        type="submit"
        disabled={isLoading || !isValid || !application}
      >
        {isLoading && <Spinner color="success" className="mr-2" />}
        Dodaj fakturę
      </Button>
    </form>
  );
}
