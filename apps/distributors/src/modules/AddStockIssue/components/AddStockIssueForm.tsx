import { useRouter } from "next/router";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "@ekosystem/ui";
import { RouterOutputs, trpc } from "../../../utils/trpc";
import frontendAddStockIssueSchema, {
  FrontendAddStockIssueSchemaType,
} from "../../../schemas/addStockIssueSchema";
import Decimal from "decimal.js";

export default function AddApplicationForm({
  invoice,
}: {
  invoice: RouterOutputs["stockIssues"]["checkInvoice"] | undefined;
}) {
  const router = useRouter();
  const {
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

  const nutCoalLeft = invoice?.declaredNutCoal
    ? new Decimal(invoice?.declaredNutCoal)
        .minus(invoice?.nutCoalWithdrawn || 0)
        .toNumber()
    : 0;

  const ecoPeaCoalLeft = invoice?.declaredEcoPeaCoal
    ? new Decimal(invoice?.declaredEcoPeaCoal)
        .minus(invoice?.ecoPeaCoalWithdrawn || 0)
        .toNumber()
    : 0;

  return (
    <form
      className={`flex w-full flex-col gap-4 transition-opacity ${
        !invoice?.id && "pointer-events-none opacity-50"
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="w-full">
          <Label htmlFor="declaredNutCoal">Ilość węgla - orzech [Kg]</Label>
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
          <Label htmlFor="declaredEcoPeaCoal">Ilość węgla - groszek [Kg]</Label>
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
      <Button color="success" type="submit" disabled={isLoading || !isValid}>
        {isLoading && <Spinner color="success" className="mr-2" />}
        Akceptuj
      </Button>
    </form>
  );
}
