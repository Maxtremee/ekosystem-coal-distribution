import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../../utils/trpc";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { InputError } from "@acme/ui";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useDebounce } from "react-use";
import frontendAddApplicationSchema, {
  FrontendAddApplicationSchemaType,
} from "../../../schemas/applicationSchema";

export default function AddApplicationForm() {
  const [debouncedApplicationName, setDebouncedApplicationName] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm<FrontendAddApplicationSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddApplicationSchema),
  });

  const router = useRouter();
  const { user } = useUser();
  const { mutate, isLoading } = trpc.applications.add.useMutation();

  trpc.applications.checkIfUnique.useQuery(
    { name: debouncedApplicationName },
    {
      enabled: !!debouncedApplicationName,
      onSuccess: (data) => {
        if (data) {
          setError("name", {
            message: "Taki wniosek już istnieje",
          });
        }
      },
    },
  );

  const onSubmit = (data: FrontendAddApplicationSchemaType) =>
    mutate(
      {
        ...data,
        issueDate: dayjs(data.issueDate).set("hour", dayjs().hour()).toDate(),
        createdBy: user?.email as string,
      },
      {
        onSuccess: () => {
          router.push("/applications");
        },
      },
    );

  const applicationNameWatch = watch("name");
  useDebounce(
    () => {
      setDebouncedApplicationName(applicationNameWatch);
    },
    600,
    [applicationNameWatch],
  );

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="applicationName">Numer wniosku</Label>
        <TextInput
          {...register("name")}
          id="applicationName"
          placeholder="Numer wniosku"
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
        Dodaj wniosek
      </Button>
    </form>
  );
}
