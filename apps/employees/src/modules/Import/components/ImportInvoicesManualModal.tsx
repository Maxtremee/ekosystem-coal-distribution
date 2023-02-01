import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export default function ImportInvoicesManualModal() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <QuestionMarkCircleIcon
        className="h-6 w-6 hover:cursor-pointer dark:text-white"
        onClick={() => setModalOpen(true)}
      />
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Importowanie faktur</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {`Aby zaimportować dokumenty należy przygotować plik o rozszerzeniu
              'txt' lub 'csv'. Dane muszą być w formacie CSV (Comma Separated
              Values), czyli kolejne pola przedzielone są znakami przecinka
              (nawet jeśli są puste) a rekordy są w osobnych liniach.`}
              <br />
              {`UWAGA: jeżeli jakakolwiek wartość zawiera w sobie
              przecinek, operacja importu się nie uda (należy takie znaki
              zamienić na np. średniki) lub powiedzie się ze złymi danymi.`}
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {"Wartości muszą być w kolejności:"}
              <ul className="flex gap-2 px-2">
                <li>Numer faktury</li>
                <li>{"Numer wniosku (opcjonalnie)"}</li>
                <li>
                  {
                    "Data wydania (w formacie 2023/01/25 lub z godziną 2023/01/25 08:00:00)"
                  }
                </li>
                <li>{"Kwota faktury (zostanie podzielona przez 2)"}</li>
              </ul>
              {"Przykładowy rekord"} (linia):{" "}
              <pre className="px-2">
                FV 1/01/23,W1/2023,2023/01/08 13:00:00,650
              </pre>
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {
                "Jeśli wystąpi jakikolwiek błąd żadne dane nie zostaną zaimportowane"
              }
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalOpen(false)}>Zamknij</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
