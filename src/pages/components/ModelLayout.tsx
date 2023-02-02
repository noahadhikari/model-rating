import { Model } from "@prisma/client";
import { env } from "../../env/client.mjs";

import CreateRating from "./CreateRating";
import ModelVisualizer from "./ModelVisualizer";
import { Button, Flex } from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";

const BASE_URL = "https://www.googleapis.com/drive/v3/files/";

interface ModelLayoutProps {
  model: Model;
}

const ModelLayout = (props: ModelLayoutProps) => {
  const { model } = props;
  const { data: nextModelData } = trpc.model.getFewestRatingModel.useQuery({ limit: 1 });
  const nextModel = nextModelData?.at(0);
  

  if (!model) {
    return <></>;
  }

  async function handleStlDownload() {
    if (model.stlId === null) {
      alert("No stlId for this model");
      return;
    }
    const url =
      BASE_URL +
      model.stlId +
      "?alt=media&key=" +
      env.NEXT_PUBLIC_GOOGLE_API_KEY;
    downloadFile(url, model.name + ".stl");
  }

  async function handleBinvoxDownload() {
    if (model.binvoxId === null) {
      alert("No binvox file found for this model");
      return;
    }
    const url =
      BASE_URL +
      model.binvoxId +
      "?alt=media&key=" +
      env.NEXT_PUBLIC_GOOGLE_API_KEY;
    downloadFile(url, model.name + ".binvox");
  }

  // download a file from a url
  async function downloadFile(url: string, filename: string) {
    const response = await fetch(url);
    if (!response.ok) {
      alert("Error downloading file");
      return;
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  // TODO: Fix this
  const handleNextModel = () => {
	if (nextModel) {
	  window.location.href = "/model/" + nextModel.id;
	} else {
	  alert("Error finding next model");
	}
  }

  return (
    <div className="modelWrapper">
      <div className="stlViewer">
        <ModelVisualizer
          model={model}
          orbitControls={true}
          shadows={true}
          showAxes={true}
        />
      </div>
      <Flex
        flexDir="column"
        justifyContent="space-between"
        className="ratingWrapper"
		pl={4}
		pr={4}
      >
        <CreateRating modelId={model.id} modelName={model.name} />

        <Flex flexDir="column">
		  <Button mb={2} colorScheme="blue" onClick={handleNextModel}>
			Next Model
		  </Button>
          <Button mb={2} colorScheme="orange" onClick={handleStlDownload}>
            Download STL
          </Button>
          <Button colorScheme="cyan" onClick={handleBinvoxDownload}>
            Download Binvox
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ModelLayout;
