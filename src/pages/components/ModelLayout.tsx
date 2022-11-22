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
      <div>
        <button onClick={handleStlDownload}>Download STL</button>
        <br />
        <button onClick={handleBinvoxDownload}>Download Binvox</button>
      </div>
      <div className="modelWrapper">
        <div className="stlViewer">
          <ModelVisualizer
            model={model}
            orbitControls={true}
            shadows={true}
            showAxes={true}
          />
        </div>
        <CreateRating modelId={model.id} modelName={model.name} />
      </div>
    </>
  );
};

export default ModelLayout;
