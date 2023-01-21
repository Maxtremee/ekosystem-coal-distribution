import { useRouter } from "next/router";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "@ekosystem/ui";
import { RouterOutputs, trpc } from "../../../utils/trpc";
import frontendAddStockIssueSchema, {
  FrontendAddStockIssueSchemaType,
} from "../../../schemas/addStockIssueSchema";

export default function AddStockIssueForm({
  invoice,
}: {
  invoice: RouterOutputs["stockIssues"]["checkInvoice"] | undefined;
}) {
  const router = useRouter();
  const {
    watch,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FrontendAddStockIssueSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendAddStockIssueSchema),
  });

  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.stockIssues.add.useMutation();

  const onSubmit = (data: FrontendAddStockIssueSchemaType) =>
    mutate(
      { ...data, invoiceId: invoice?.id as string },
      {
        onSuccess: (res) => {
          router.replace(`/stock-issues/${res.id}`);
        },
      },
    );

  const nutCoalWatch = watch("nutCoalIssued") || 0;
  const ecoPeaCoalWatch = watch("ecoPeaCoalIssued") || 0;
  const nutCoalLeft = (invoice?.coalLeftToIssue || 0) - ecoPeaCoalWatch;
  const ecoPeaCoalLeft = (invoice?.coalLeftToIssue || 0) - nutCoalWatch;

  return (
    <form
      className={`flex w-full flex-col gap-4 transition-opacity ${
        !invoice?.id && "pointer-events-none opacity-50"
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Label htmlFor="nutCoalIssued">Ilość węgla - orzech [Kg]</Label>
          <TextInput
            {...register("nutCoalIssued", {
              max: nutCoalLeft,
            })}
            id="nutCoalIssued"
            placeholder="Ilość węgla"
            type="number"
            helperText={`Pozostało do odebrania: ${nutCoalLeft} kg`}
            max={nutCoalLeft}
            min={0}
          />
          <InputError error={errors?.nutCoalIssued?.message} />
        </div>
        <div className="w-full">
          <Label htmlFor="ecoPeaCoalIssued">Ilość węgla - groszek [Kg]</Label>
          <TextInput
            {...register("ecoPeaCoalIssued", {
              max: ecoPeaCoalLeft,
            })}
            id="ecoPeaCoalIssued"
            placeholder="Ilość węgla"
            type="number"
            helperText={`Pozostało do odebrania: ${ecoPeaCoalLeft} kg`}
            max={ecoPeaCoalLeft}
            min={0}
          />
          <InputError error={errors?.ecoPeaCoalIssued?.message} />
        </div>
        <InputError error={mutationError?.message} />
      </div>
      <div className="w-full">
        <Label htmlFor="additionalInformation">
          Dodatkowe informacje (opcjonalnie)
        </Label>
        <Textarea
          {...register("additionalInformation")}
          id="additionalInformation"
          placeholder="Dodatkowe informacje"
          rows={3}
        />
        <InputError error={errors?.ecoPeaCoalIssued?.message} />
      </div>
      <InputError error={mutationError?.message} />
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Akceptuj
      </Button>
    </form>
  );
}
