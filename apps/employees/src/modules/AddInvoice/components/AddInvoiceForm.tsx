import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../../utils/trpc";
import addInvoiceSchema, {
  AddInvoiceSchemaType,
} from "../../../schemas/addInvoiceSchema";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { InputError } from "@acme/ui";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useDebounce } from "react-use";

export default function AddInvoiceForm() {
  const [debouncedApplicationId, setDebouncedApplicationId] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm<AddInvoiceSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(addInvoiceSchema),
  });

  const router = useRouter();
  const { user } = useUser();
  const { mutate, isLoading } = trpc.invoices.add.useMutation();

  const applicationIdWatch = watch("applicationId");
  trpc.invoices.checkApplicationIdUnique.useQuery(
    { applicationId: debouncedApplicationId },
    {
      enabled: !!applicationIdWatch,
      onSuccess: (data) => {
        if (data) {
          setError("applicationId", {
            message: "Taki numer wniosku już istnieje",
          });
        }
      },
    },
  );

  const onSubmit = (data: AddInvoiceSchemaType) =>
    mutate(
      {
        ...data,
        issueDate: dayjs(data.issueDate).set("hour", dayjs().hour()).toDate(),
      },
      {
        onSuccess: () => {
          router.push("/invoices");
        },
      },
    );

  useDebounce(
    () => {
      setDebouncedApplicationId(applicationIdWatch);
    },
    600,
    [applicationIdWatch],
  );

  useEffect(() => {
    setValue("createdBy", user?.email as string);
  }, [user]);

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="applicationId">Numer wniosku</Label>
        <TextInput
          {...register("applicationId")}
          id="applicationId"
          placeholder="Numer wniosku"
        />
        <InputError error={errors?.applicationId?.message} />
      </div>
      <div>
        <Label htmlFor="invoiceName">Nazwa faktury</Label>
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
          <Label htmlFor="declaredNutCoal">
            Zadeklarowana ilość węgla - orzech [Kg]
          </Label>
          <TextInput
            {...register("declaredNutCoal")}
            id="declaredNutCoal"
            placeholder="Ilość węgla"
            type="number"
          />
          <InputError error={errors?.declaredNutCoal?.message} />
        </div>
        <div className="w-full">
          <Label htmlFor="declaredEcoPeaCoal">
            Zadeklarowana ilość węgla - groszek [Kg]
          </Label>
          <TextInput
            {...register("declaredEcoPeaCoal")}
            id="declaredEcoPeaCoal"
            placeholder="Ilość węgla"
            type="number"
          />
          <InputError error={errors?.declaredEcoPeaCoal?.message} />
        </div>
      </div>
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Dodaj fakturę
      </Button>
    </form>
  );
}
