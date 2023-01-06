import { InputError } from "@ekosystem/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import registerDistributionCenterSchema, {
  RegisterDistributionCenterSchemaType,
} from "../../../schemas/registerDistributionCenterSchema";
import { trpc } from "../../../utils/trpc";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<RegisterDistributionCenterSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(registerDistributionCenterSchema),
  });

  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.distributionCenters.register.useMutation();

  const onSubmit = (data: RegisterDistributionCenterSchemaType) =>
    mutate(data, {
      onSuccess: () => {
        router.replace(`/`);
      },
    });

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="w-full">
          <Label htmlFor="declaredNutCoal">Nazwa</Label>
          <TextInput {...register("name")} id="name" placeholder="Nazwa" />
          <InputError error={errors?.name?.message} />
        </div>
        <div className="w-full">
          <Label htmlFor="address">Adres</Label>
          <Textarea
            {...register("address")}
            id="address"
            placeholder="Adres"
            rows={3}
          />
          <InputError error={errors?.address?.message} />
        </div>
        {mutationError && <InputError error={mutationError.message} />}
      </div>
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Zarejestruj
      </Button>
    </form>
  );
}
