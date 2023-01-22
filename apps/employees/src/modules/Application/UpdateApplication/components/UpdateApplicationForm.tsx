import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../../../utils/trpc";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { InputError } from "@ekosystem/ui";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import frontendAddApplicationSchema, {
  FrontendAddApplicationSchemaType,
} from "../../../../schemas/applicationSchema";
import { Application } from "@ekosystem/db";
import Decimal from "decimal.js";

export default function UpdateApplicationForm({
  application,
}: {
  application: Application;
}) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.applications.update.useMutation();
  const {
    setError,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FrontendAddApplicationSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddApplicationSchema),
    defaultValues: {
      applicationId: application.applicationId,
      additionalInformation: application?.additionalInformation || undefined,
      declaredEcoPeaCoal: application?.declaredEcoPeaCoal
        ? new Decimal(application.declaredEcoPeaCoal).toNumber()
        : undefined,
      declaredNutCoal: application?.declaredNutCoal
        ? new Decimal(application.declaredNutCoal).toNumber()
        : undefined,
      // @ts-ignore
      issueDate: dayjs(application?.issueDate).format("YYYY-MM-DD"),
      showApplicationIdField: !!application?.applicationId,
    },
  });

  const onSubmit = (data: FrontendAddApplicationSchemaType) =>
    mutate(
      {
        ...data,
        issueDate: dayjs(data.issueDate)
          .set("hour", dayjs(application.issueDate).hour())
          .toDate(),
        id: application.id,
      },
      {
        onSuccess: (res) => {
          router.replace(`/applications/${res.id}`);
        },
        onError: (err) => {
          setError("applicationId", {
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
        <Label htmlFor="app">Numer wniosku</Label>
        <TextInput
          {...register("applicationId")}
          id="applicationId"
          placeholder="Numer wniosku"
        />
        <InputError error={errors?.applicationId?.message} />
      </div>
      <div>
        <Label htmlFor="additionalInformation">
          Dodatkowe informacje (opcjonalnie)
        </Label>
        <Textarea
          {...register("additionalInformation")}
          id="additionalInformation"
          placeholder="Dodatkowe informacje"
          rows={3}
        />
        <InputError error={errors?.additionalInformation?.message} />
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
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Label htmlFor="declaredNutCoal">
            Zadeklarowana ilość węgla - orzech [Kg]
          </Label>
          <TextInput
            {...register("declaredNutCoal")}
            id="declaredNutCoal"
            placeholder="Ilość węgla"
            type="number"
            min={0}
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
            min={0}
          />
          <InputError error={errors?.declaredEcoPeaCoal?.message} />
        </div>
      </div>
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Aktualizuj wniosek
      </Button>
    </form>
  );
}
