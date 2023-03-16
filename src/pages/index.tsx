import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import CreateModel from "./components/CreateModel";
import CreateRating from "./components/CreateRating";
import SearchModel from "./components/SearchModel";
import React, { useEffect, useState } from "react";

import {} from "../utils/drive-utils";
import HeaderBar from "./components/HeaderBar";
import { signIn, useSession } from "next-auth/react";
import Layout from "./components/Layout/Layout";
import Landing from "./components/Layout/Landing";
import ImportRatings from "./components/ImportRatings";

const Home: NextPage = () => {
  const syncMutation = trpc.model.syncModelsInFolder.useMutation();
  const [isSyncing, setIsSyncing] = useState(false);
  const session = useSession();

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
    ["PARTS_4_1_5500", "1xXbNZ2fGW_9wz3ezM84ckqCq91cTySwR"],
    ["PARTS_4_5501_8000", "1I5fMkCzS26gT4yjnd5VIB80ga2glWzNc"],
    ["PARTS_4_8001_10154", "1RlXw5gWgBt9Ce2nHgrdPy-1i5dCPKf-7"],
  ]);

  //   async function handleSync() {
  //     if (isSyncing) {
  //       alert("Sync already in progress");
  //       return;
  //     }
  //     setIsSyncing(true);
  //     const start = performance.now();
  //     await Promise.all(
  //       Array.from(allFileFolders.values()).map((folderId) =>
  //         syncMutation.mutateAsync({ folderId })
  //       )
  //     ).then((values) => {
  //       const numFiles = values.reduce((a, b) => a + b, 0);
  //       setIsSyncing(false);
  //       alert(
  //         `Synced ${numFiles} files in ${Math.trunc(
  //           performance.now() - start
  //         )} ms`
  //       );
  //     });
  //   }

  //   async function handleNextFewestRated() {
  //     if (
  //       nextFewestRated &&
  //       nextFewestRated.data &&
  //       nextFewestRated.data.length > 0 &&
  //       nextFewestRated.data[0]
  //     ) {
  //       // go to the next fewest rated model page
  //       window.location.href = `/model/${nextFewestRated.data[0].id}`;
  //     } else {
  //       alert("Error finding model");
  //     }
  //   }

  //   const importRatingsMutation = trpc.rating.importRatings.useMutation();
  //   const getAllRatingsQuery = trpc.rating.getAllRatings.useQuery();

  const csvData = "";

  const createRatingFromNameMutation =
    trpc.rating.createRatingFromName.useMutation();
  const handlePrintCsvData = async () => {
    const csv = csvData.split("\n");
    const csvDataArray = csv.map((row) => {
      const rowData = row.split(",");
      return rowData;
    });

    const result = [];
    for (const row of csvDataArray) {
      const [modelName, score, reasoning] = row;
      result.push({
        modelName: modelName!,
        score: parseInt(score!),
        reasoning,
      });
    }

    // Call createRatingMutation for each row
    let i = 0;
    for (const row of result) {
      const { modelName, score, reasoning } = row;
      await createRatingFromNameMutation.mutateAsync({
        modelName: modelName.trim(),
        score,
        reasoning,
      });
      console.log("iter", i++);
    }
  };
  //   useEffect(() => {
  // 	if (session?.data?.user) {
  // 		console.log("session", session)
  //       handlePrintCsvData();
  // 	}
  //   }, [session]);

  return (
    <Layout>
      <Landing />
      {session?.data?.user && (
        <ImportRatings />
        // <button onClick={handlePrintCsvData}>Sync</button>
      )}
    </Layout>
  );
  //   return (
  //     <>
  //       <div className="indexWrapper">
  //         <HeaderBar />
  // 		<button onClick={handleLogin}>Login</button>
  //         <SearchModel />
  //         <footer>
  //           <button name="nextFewestRated" onClick={handleNextFewestRated}>
  //             Jump to model with fewest ratings
  //           </button>
  //           <button name="syncModels" onClick={handleSync}>
  //             Sync Models with Google Drive (<b>use sparingly!</b>)
  //           </button>
  //         </footer>
  //       </div>
  //     </>
  //   );
};

export default Home;
