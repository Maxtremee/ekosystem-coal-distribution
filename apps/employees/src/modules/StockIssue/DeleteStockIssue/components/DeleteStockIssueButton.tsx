import { StockIssue } from "@ekosystem/db";
import { Text } from "@ekosystem/ui";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Modal, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../../../utils/trpc";

export default function DeleteStockIssueButton({ id }: Pick<StockIssue, "id">) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate, isLoading } = trpc.stockIssues.delete.useMutation();

  const submit = () => {
    mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          router.replace("/stock-issues");
        },
      },
    );
  };

  return (
    <>
      <Button color="failure" onClick={() => setModalOpen(true)}>
        {"Usuń"}
      </Button>
      <Modal
        show={modalOpen}
        size="md"
        popup
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <Text as="h3" className="mb-4">
              {`Czy na pewno chcesz usunąć wydanie?`}
            </Text>
            <div className="flex justify-center gap-4">
              <Button
                color="warning"
                onClick={() => setModalOpen(false)}
                disabled={isLoading}
              >
                Nie
              </Button>
              {isLoading ? (
                <Button color="failure" disabled>
                  <Spinner />
                </Button>
              ) : (
                <Button color="failure" onClick={submit}>
                  Tak
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
