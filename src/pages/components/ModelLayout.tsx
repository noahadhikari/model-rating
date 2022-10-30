import { IsBestOrientation, Model } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

import { ModelDimensions, StlViewer } from "react-stl-viewer";
import { env } from "../../env/client.mjs";

import Head from "next/head";
import CreateModel from "./CreateModel";
import CreateRating from "./CreateRating";
import ModelVisualizer from "./ModelVisualizer";

const BASE_URL = "https://www.googleapis.com/drive/v3/files/";

interface ModelLayoutProps {
  model: Model;
}

const ModelLayout = (props: ModelLayoutProps) => {
  const { model } = props;

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
        <title>Model {model.id}</title>
        <meta name="description" content="Rate Model" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="modelWrapper">
        <ModelVisualizer model={model} orbitControls={true} shadows={true} showAxes={true} />
        <CreateRating modelId={model.id} modelName={model.name} />
      </div>
    </>
  );
};

export default ModelLayout;
