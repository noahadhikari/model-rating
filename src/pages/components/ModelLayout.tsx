import { IsBestOrientation, Model } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

import { ModelDimensions, StlViewer } from "react-stl-viewer";
import { env } from "../../env/client.mjs";

import Head from "next/head";
import CreateModel from "./CreateModel";
import CreateRating from "./CreateRating";

const BASE_URL = "https://www.googleapis.com/drive/v3/files/";

interface ModelLayoutProps {
  model: Model;
}

const ModelLayout = (props: ModelLayoutProps) => {
  const { model } = props;
  // console.log(env);
  const url =
    BASE_URL + model?.stlId + "?alt=media&key=" + env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [modelDimensions, setModelDimensions] = useState<ModelDimensions>();

  function makeModelProps(modelDims: ModelDimensions | undefined) {
    var modelProps = {
      color: "#15404f",
      positionX: 0,
      positionY: 0,
    };
    if (modelDims) {
      modelProps.positionX = modelDims.width;
      modelProps.positionY = modelDims.length;
    }
    return modelProps;
  }

  function makeFloorProps(modelDims: ModelDimensions | undefined) {
    var floorProps = {
      gridWidth: 200,
      gridLength: 200,
    };
    if (modelDims) {
      floorProps.gridWidth = modelDims.width * 2;
      floorProps.gridLength = modelDims.length * 2;
    }
    return floorProps;
  }

  const modelStyle = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#eee",
  };

  return (
    <>
      <Head>
        <title>{model?.name}</title>
        <meta name="description" content="Rate Model" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="modelWrapper">
        <div className="stlViewer">
          <StlViewer
            url={url}
            style={modelStyle}
            orbitControls
            shadows
            showAxes
            onFinishLoading={setModelDimensions}
            modelProps={makeModelProps(modelDimensions)}
            floorProps={makeFloorProps(modelDimensions)}
          />
        </div>
        <CreateRating modelId={model?.id} modelName={model?.name} />
      </div>
    </>
  );
};

export default ModelLayout;
