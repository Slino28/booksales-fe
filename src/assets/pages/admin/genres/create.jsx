import ResourceForm from "../../../components/admin/ResourceForm";
import { genreFields } from "./fields";

export default function GenreCreate() {
  return <ResourceForm noun="genre" endpoint="/genres" basePath="/admin/genres" fields={genreFields} />;
}
