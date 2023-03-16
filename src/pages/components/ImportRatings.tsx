import { Importer, ImporterField } from "react-csv-importer";
import "react-csv-importer/dist/index.css";
import { trpc } from "../../utils/trpc";

interface ImportedRating {
  modelName: string;
  score: string;
}

const ImportRatings = () => {
  const importRatingsMutation = trpc.rating.importAutoRatings.useMutation();
  return (
    <Importer
      defaultNoHeader
      restartable
      dataHandler={async (rows) => {
        const ratingsImported = rows as unknown as ImportedRating[];
        importRatingsMutation.mutateAsync(ratingsImported);
      }}
      onComplete={() => {
        console.log("Import complete");
      }}
    >
      <ImporterField name="modelName" label="Model Name" />
      <ImporterField name="score" label="Score" />
    </Importer>
  );
};

export default ImportRatings;
