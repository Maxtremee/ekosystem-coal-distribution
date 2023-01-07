import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import InvoiceList from "../../modules/Invoice/InvoicesList";

function InvoicesPage() {
  return <InvoiceList />;
}

export default withPageAuthRequired(InvoicesPage);
