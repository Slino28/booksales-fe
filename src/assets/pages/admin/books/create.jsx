import ResourceForm from "../../../components/admin/ResourceForm";
import { bookFields } from "./fields";

export default function BookCreate() {
  return <ResourceForm noun="buku" endpoint="/books" basePath="/admin/books" fields={bookFields} />;
}
