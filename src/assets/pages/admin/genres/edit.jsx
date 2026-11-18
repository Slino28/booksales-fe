import ResourceForm from "../../../components/admin/ResourceForm";
import { genreFields } from "./fields";

export default function GenreEdit() {
  return <ResourceForm noun="genre" endpoint="/genres" basePath="/admin/genres" fields={genreFields} />;
}
