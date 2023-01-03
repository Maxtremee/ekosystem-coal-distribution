import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouterOutputs, trpc } from "../../../utils/trpc";
import frontendAddInvoiceSchema, {
  FrontendAddInvoiceSchemaType,
} from "../../../schemas/invoiceSchema";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { InputError } from "@acme/ui";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useDebounce } from "react-use";
import Decimal from "decimal.js";

export default function AddInvoiceForm({
  application,
}: {
  application?: RouterOutputs["invoices"]["checkIfApplicationExists"];
}) {
  const router = useRouter();
  const { user } = useUser();
  const { mutate, isLoading } = trpc.invoices.add.useMutation();
  const [debounceInvoiceName, setDebouncedInvoiceName] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm<FrontendAddInvoiceSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddInvoiceSchema),
  });

  const nutCoalLeft = application?.declaredNutCoal
    ? new Decimal(application?.declaredNutCoal)
        .minus(application.nutCoalInInvoices)
        .toNumber()
    : 0;

  const ecoPeaCoalLeft = application?.declaredEcoPeaCoal
    ? new Decimal(application?.declaredEcoPeaCoal)
        .minus(application.ecoPeaCoalInInvoices)
        .toNumber()
    : 0;

  trpc.invoices.checkIfUnique.useQuery(
    { name: debounceInvoiceName },
    {
      enabled: !!debounceInvoiceName,
      onSuccess: (data) => {
        if (data) {
          setError("name", {
            message: "Taki numer faktury już istnieje",
            type: "value",
          });
        }
      },
    },
  );

  const onSubmit = (data: FrontendAddInvoiceSchemaType) =>
    mutate(
      {
        ...data,
        issueDate: dayjs(data.issueDate).set("hour", dayjs().hour()).toDate(),
        applicationId: application?.id as string,
        createdBy: user?.email as string,
      },
      {
        onSuccess: () => {
          router.push("/applications");
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

  return (
    <form
      className={`flex w-full flex-col gap-4 ${
        !application && "pointer-events-none opacity-50"
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="invoiceName">Nazwa faktury </Label>
        <TextInput
          {...register("name")}
          id="invoiceName"
          placeholder="Nazwa faktury"
        />
        <InputError error={errors?.name?.message} />
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
        Dodaj fakturę
      </Button>
    </form>
  );
}
