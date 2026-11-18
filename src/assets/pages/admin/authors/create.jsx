import ResourceForm from "../../../components/admin/ResourceForm";
import { authorFields } from "./fields";

export default function AuthorCreate() {
  return <ResourceForm noun="penulis" endpoint="/authors" basePath="/admin/authors" fields={authorFields} />;
}
