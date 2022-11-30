import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import CreateModel from "./components/CreateModel";
import CreateRating from "./components/CreateRating";
import SearchModel from "./components/SearchModel";
import React, { useState } from "react";

import {} from "../utils/drive-utils";
import HeaderBar from "./components/HeaderBar";

const Home: NextPage = () => {
  const syncMutation = trpc.model.syncModelsInFolder.useMutation();
  const nextFewestRated = trpc.model.getFewestRatingModel.useQuery({});
  const [isSyncing, setIsSyncing] = useState(false);

  const allFileFolders = new Map([
    ["URAP3D_STL", "1P0k67JaVkJRyFysUC_G8bKmRQQD_TKhq"],
    ["CAD_PARTS_FOLDER", "1kvid8nlRhSFrnIzrZbjt5uOOuEixPBpN"],
    ["PARTS_0_1_3950", "1rIlKhyHHyQ55RW8igH7ywnH0hXMLDwA_"],
    ["PARTS_0_3951_5450", "1cKpVz3Vol2F8-i-V6ixnGkH94Al8VsjP"],
    ["PARTS_0_5451_9606", "1CkJ30EDPfz8g0okPQPW19vkoqzdClYg8"],
    ["PARTS_1_1_2500", "1j_J4PxkVZlfP7kqhP4JwyUG29bYVLbNJ"],
    ["PARTS_1_2501_7500", "155SmkUlp2Z8nVb_VjUgoTNPRMO1jl9gQ"],
    ["PARTS_1_7501_11227", "1ZtDlxIVOq_B6gbryrtXZTQXJpv3bodEv"],
    ["PARTS_2_1_3500", "1Ju7G3RB-KLtC4i8drcGdN2YEcUczueov"],
    ["PARTS_2_3501_7500", "1kUIWVdyryIcETdOQik29T1DPVZAWJ9-a"],
    ["PARTS_2_7501_11076", "1ZwfiDKMlHZgpgZOOJhqBUwQnBFjXQhZd"],
    ["PARTS_3_1_5500", "19rsrWC1dmBtCD9uPJCC5QdwOWD7VYeY7"],
    ["PARTS_3_5501_10844", "1GOTtPLaxOlAguBdNuKfpeLn8UuA5OCxA"],
  ]);

  async function handleSync() {
    if (isSyncing) {
      alert("Sync already in progress");
      return;
    }
    setIsSyncing(true);
    const start = performance.now();
    Promise.all(
      Array.from(allFileFolders.values()).map((folderId) =>
        syncMutation.mutateAsync({ folderId })
      )
    ).then((values) => {
      const numFiles = values.reduce((a, b) => a + b, 0);
      setIsSyncing(false);
      alert(
        `Synced ${numFiles} files in ${Math.trunc(
          performance.now() - start
        )} ms`
      );
    });
  }

  async function handleNextFewestRated() {
    if (
      nextFewestRated &&
      nextFewestRated.data &&
      nextFewestRated.data.length > 0 &&
      nextFewestRated.data[0]
    ) {
      // go to the next fewest rated model page
      window.location.href = `/model/${nextFewestRated.data[0].id}`;
    } else {
      alert("Error finding model");
    }
  }

  return (
    <>
      <Head>
        <title>Model Rating</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="indexWrapper">
        <HeaderBar />
        <SearchModel />
        <footer>
          <button name="nextFewestRated" onClick={handleNextFewestRated}>
            Jump to model with fewest ratings
          </button>
          <button name="syncModels" onClick={handleSync}>
            Sync Models with Google Drive (<b>use sparingly!</b>)
          </button>
        </footer>
      </div>
    </>
  );
};

export default Home;
