import { useRouter } from "next/router";
import {
  Button,
  Label,
  Select,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "@ekosystem/ui";

import Decimal from "decimal.js";
import frontendStockIssueSchema, {
  FrontendStockIssueSchemaType,
} from "../../../../schemas/stockIssueSchema";
import { RouterOutputs, trpc } from "../../../../utils/trpc";

export default function UpdateStockIssueForm({
  stockIssue,
  invoice,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getDetails"];
  invoice: RouterOutputs["stockIssues"]["checkInvoice"] | undefined;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FrontendStockIssueSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(frontendStockIssueSchema),
    defaultValues: {
      distributionCenterId: stockIssue?.distributionCenterId || undefined,
      additionalInformation: stockIssue?.additionalInformation || undefined,
      ecoPeaCoalIssued: stockIssue?.ecoPeaCoalIssued
        ? new Decimal(stockIssue.ecoPeaCoalIssued).toNumber()
        : undefined,
      nutCoalIssued: stockIssue?.nutCoalIssued
        ? new Decimal(stockIssue.nutCoalIssued).toNumber()
        : undefined,
    },
  });

  const {
    mutate,
    isLoading,
    error: mutationError,
  } = trpc.stockIssues.update.useMutation();

  const {
    data: centers,
    isLoading: isLoadingCenters,
    isError: centersError,
  } = trpc.distributionCenters.getIdsAndNames.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const onSubmit = (data: FrontendStockIssueSchemaType) =>
    mutate(
      { ...data, invoiceId: invoice?.id as string, id: stockIssue.id },
      {
        onSuccess: (res) => {
          router.replace(`/stock-issues/${res.id}`);
        },
      },
    );

  const nutCoalLeft = invoice?.declaredNutCoal
    ? new Decimal(invoice?.declaredNutCoal)
        .minus(invoice?.nutCoalWithdrawn || 0)
        .add(new Decimal(stockIssue?.nutCoalIssued || 0))
        .toNumber()
    : 0;

  const ecoPeaCoalLeft = invoice?.declaredEcoPeaCoal
    ? new Decimal(invoice?.declaredEcoPeaCoal)
        .minus(invoice?.ecoPeaCoalWithdrawn || 0)
        .add(new Decimal(stockIssue?.ecoPeaCoalIssued || 0))
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
        <div>
          <Label htmlFor="search">Wydane przez</Label>
          <Select
            {...register("distributionCenterId")}
            id="distributionCenterId"
            className="w-full md:w-80"
            placeholder="Wybierz skup węgla"
            disabled={isLoadingCenters || centersError || centers?.length < 1}
          >
            {centers?.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
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
        Aktualizuj wydanie
      </Button>
    </form>
  );
}
