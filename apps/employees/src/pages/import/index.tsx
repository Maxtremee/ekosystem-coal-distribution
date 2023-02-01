import { RefObject, useRef, useState } from "react";
import { InputError, Text } from "@ekosystem/ui";
import { Label, FileInput, Button, Modal } from "flowbite-react";
import { trpc } from "../../utils/trpc";
import fileToBase64 from "../../utils/fileToBase64";
import { ParsingError } from "../../modules/Import/ParsingError";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ImportStockIssuesManualModal from "../../modules/Import/components/ImportStockIssuesManualModal";
import ImportInvoicesManualModal from "../../modules/Import/components/ImportInvoicesManualModal";

export default function ImportPage() {
  const [parsingError, setParsingError] = useState<ParsingError>();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const invoicesRef = useRef<HTMLInputElement>(null);
  const stockIssuesRef = useRef<HTMLInputElement>(null);
  const { mutate, data, isLoading, error } = trpc.import.file.useMutation();

  const sendFile = async (
    fileRef: RefObject<HTMLInputElement>,
    type: "invoices" | "stockIssues",
  ) => {
    if (fileRef.current?.files?.item(0) instanceof File) {
      mutate(
        {
          data: await fileToBase64(fileRef.current?.files?.item(0) as File),
          type,
        },
        {
          onError: (err) => {
            try {
              setParsingError(JSON.parse(err.message) as ParsingError);
            } catch {
              setParsingError(undefined);
            }
          },
          onSuccess: () => {
            setParsingError(undefined);
            setSuccessModalOpen(true);
            if (fileRef?.current?.value) {
              fileRef.current.value = "";
            }
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Importuj
      </Text>
      <InputError
        error={
          parsingError
            ? `Błąd w linii: ${parsingError.lineNumber}: ${JSON.stringify(
                parsingError.message,
                undefined,
                2,
              )}`
            : error?.message
        }
      />
      <div className="flex items-end gap-4">
        <div className="w-full">
          <div className="mb-2 flex gap-2">
            <Label htmlFor="invoices">Importuj faktury</Label>
            <ImportInvoicesManualModal />
          </div>
          <FileInput
            ref={invoicesRef}
            id="invoices"
            accept="text/csv, text/plain"
          />
        </div>
        <Button
          disabled={isLoading}
          onClick={() => sendFile(invoicesRef, "invoices")}
          className="w-32"
        >
          Importuj
        </Button>
      </div>
      <div className="flex items-end gap-4">
        <div className="w-full">
          <div className="mb-2 flex gap-2">
            <Label htmlFor="stockIssues">Importuj wydania</Label>
            <ImportStockIssuesManualModal />
          </div>
          <FileInput
            ref={stockIssuesRef}
            id="stockIssues"
            accept="text/csv, text/plain"
          />
        </div>
        <Button
          disabled={isLoading}
          onClick={() => sendFile(stockIssuesRef, "stockIssues")}
          className="w-32"
        >
          Importuj
        </Button>
      </div>
      <Modal
        show={successModalOpen}
        size="md"
        popup
        onClose={() => setSuccessModalOpen(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <CheckCircleIcon className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <Text as="h3" className="mb-4">
              Zaimportowano pomyślnie dokumentów: {data?.imported}
            </Text>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setSuccessModalOpen(false)}>
                Zamknij
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
