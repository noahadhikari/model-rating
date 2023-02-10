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

  const importRatingsMutation = trpc.rating.importRatings.useMutation();
  const {data} = trpc.rating.getAllRatings.useQuery();
  console.log('data', data)

  const csvData = `2a5d8b29-580b-46da-8e59-4a4f1d2856e3,-2,
  2a88ca51-9b3c-408c-9731-9ca3b021cd1b,-2,
  2a88ca51-9b3c-408c-9731-9ca3b021cd1b.stl00-1,-2,
  2a88ca51-9b3c-408c-9731-9ca3b021cd1b.stl100,-2,
  2a88ca51-9b3c-408c-9731-9ca3b021cd1b.stl-100,-2,
  2a254b41-eeb2-43b3-b1ba-b6b65ea5d301,-2,
  2a254b41-eeb2-43b3-b1ba-b6b65ea5d301.stl00-1,-2,
  2a254b41-eeb2-43b3-b1ba-b6b65ea5d301.stl0-10,-2,
  2a254b41-eeb2-43b3-b1ba-b6b65ea5d301.stl010,-2,
  2a666f7a-1353-4199-988d-5dc549d63bb8.stl0-10,-2,
  2a666f7a-1353-4199-988d-5dc549d63bb8.stl100,-2,
  2a666f7a-1353-4199-988d-5dc549d63bb8.stl-100,-2,
  2a6458cf-ff3c-495d-b9eb-3ca8d6df94ee.stl0-10,-2,
  2a6458cf-ff3c-495d-b9eb-3ca8d6df94ee.stl010,-2,
  2a6458cf-ff3c-495d-b9eb-3ca8d6df94ee.stl100,-2,
  2a6458cf-ff3c-495d-b9eb-3ca8d6df94ee.stl-100,-2,
  2a603729-d0a6-43b1-b1fc-ed3a171873a0.stl0-10,-2,
  2a603729-d0a6-43b1-b1fc-ed3a171873a0.stl010,-2,
  2aefb65f-8a8d-4dd7-929a-9293e9958dab,-2,a`;
  //   2aefb65f-8a8d-4dd7-929a-9293e9958dab.stl00-1,-2,
  //   2aefb65f-8a8d-4dd7-929a-9293e9958dab.stl0-10,-2,
  //   2aefb65f-8a8d-4dd7-929a-9293e9958dab.stl010,-2,
  //   2b1a9001-a331-42df-a5d9-b1857d2e666a,-2,
  //   2b1a9001-a331-42df-a5d9-b1857d2e666a.stl00-1,-2,
  //   2b1a9001-a331-42df-a5d9-b1857d2e666a.stl0-10,-2,
  //   2b1a9001-a331-42df-a5d9-b1857d2e666a.stl010,-2,
  //   2b4d7b78-27d6-4a9f-9dd0-84a71207f8fa,-2,
  //   2b4d7b78-27d6-4a9f-9dd0-84a71207f8fa.stl00-1,-2,
  //   2b4d7b78-27d6-4a9f-9dd0-84a71207f8fa.stl0-10,-2,
  //   2b4d7b78-27d6-4a9f-9dd0-84a71207f8fa.stl100,-2,
  //   2b4d7b78-27d6-4a9f-9dd0-84a71207f8fa.stl-100,-2,
  //   2b7a456e-d6f2-4d69-b869-cfaf67c2eb65.stl-100,-2,
  //   2b9a975e-6cca-4008-92ed-c0dda6ba1568,-2,
  //   2b9a975e-6cca-4008-92ed-c0dda6ba1568.stl00-1,-2,
  //   2b9a975e-6cca-4008-92ed-c0dda6ba1568.stl0-10,-2,
  //   2b9a975e-6cca-4008-92ed-c0dda6ba1568.stl010,-2,
  //   2b9a975e-6cca-4008-92ed-c0dda6ba1568.stl100,-2,
  //   2b9a975e-6cca-4008-92ed-c0dda6ba1568.stl-100,-2,
  //   2b9c4f99-c7c7-4f52-8648-d5c18e7b309d,-2,
  //   2b9c4f99-c7c7-4f52-8648-d5c18e7b309d.stl00-1,-2,
  //   2b9c4f99-c7c7-4f52-8648-d5c18e7b309d.stl100,-2,
  //   2b9c4f99-c7c7-4f52-8648-d5c18e7b309d.stl-100,-2,
  //   2b51b3e2-ceb4-4bb3-9e3a-3183f04b02b9,-2,
  //   2b51b3e2-ceb4-4bb3-9e3a-3183f04b02b9.stl00-1,-2,
  //   2b51b3e2-ceb4-4bb3-9e3a-3183f04b02b9.stl100,-2,
  //   2b51b3e2-ceb4-4bb3-9e3a-3183f04b02b9.stl-100,-2,
  //   2b73acdc-186f-45a4-b9fa-9c941a0e7cd0.stl100,-2,
  //   2b73acdc-186f-45a4-b9fa-9c941a0e7cd0.stl-100,-2,
  //   2b84938c-df02-445d-b4d0-44efe98ee546,-2,
  //   2b84938c-df02-445d-b4d0-44efe98ee546.stl00-1,-2,
  //   2b84938c-df02-445d-b4d0-44efe98ee546.stl100,-2,
  //   2b84938c-df02-445d-b4d0-44efe98ee546.stl-100,-2,
  //   2ba88e70-68f4-495b-be5b-3d4d5e3312d1,-2,
  //   2ba88e70-68f4-495b-be5b-3d4d5e3312d1.stl00-1,-2,
  //   2ba88e70-68f4-495b-be5b-3d4d5e3312d1.stl0-10,-2,
  //   2ba88e70-68f4-495b-be5b-3d4d5e3312d1.stl010,-2,
  //   2c4e2d0f-25bd-4a4d-9603-91c13d17180c,-2,
  //   2c4e2d0f-25bd-4a4d-9603-91c13d17180c.stl00-1,-2,
  //   2c4e2d0f-25bd-4a4d-9603-91c13d17180c.stl100,-2,
  //   2c4e2d0f-25bd-4a4d-9603-91c13d17180c.stl-100,-2,
  //   2c6c447c-50e5-441b-b976-cc0d0abe7bc2.stl0-10,-2,
  //   2c6c447c-50e5-441b-b976-cc0d0abe7bc2.stl010,-2,
  //   2c6c447c-50e5-441b-b976-cc0d0abe7bc2.stl100,-2,
  //   2c6c447c-50e5-441b-b976-cc0d0abe7bc2.stl-100,-2,
  //   2c54fb4a-9743-4060-ac1a-e8bad5c4714e.stl0-10,-2,
  //   2c54fb4a-9743-4060-ac1a-e8bad5c4714e.stl010,-2,
  //   2c950e64-9868-40da-aca4-1c6396208df4,-2,
  //   2c950e64-9868-40da-aca4-1c6396208df4.stl00-1,-2,
  //   2c950e64-9868-40da-aca4-1c6396208df4.stl100,-2,
  //   2c950e64-9868-40da-aca4-1c6396208df4.stl-100,-2,
  //   2a8dc714-07ee-4db9-9430-c07923c85609,-1,
  //   2a8dc714-07ee-4db9-9430-c07923c85609.stl00-1,-1,
  //   2a8dc714-07ee-4db9-9430-c07923c85609.stl100,-1,
  //   2a8dc714-07ee-4db9-9430-c07923c85609.stl-100,-1,
  //   2a39eb79-d6f3-4cd3-8d63-cd6f9e8a6c66.stl0-10,-1,LARGE AREA
  //   2a666f7a-1353-4199-988d-5dc549d63bb8.stl00-1,-1,LARGE FIRST LAYER AREA
  //   2a666f7a-1353-4199-988d-5dc549d63bb8.stl010,-1,STABLE FIRST LAYER
  //   2a603729-d0a6-43b1-b1fc-ed3a171873a0,-1,
  //   2a603729-d0a6-43b1-b1fc-ed3a171873a0.stl00-1,-1,
  //   2ab3dc7a-fa39-41db-9985-7ee700f7ab03.stl100,-1,AXIS FACING PLATE
  //   2b7a456e-d6f2-4d69-b869-cfaf67c2eb65,-1,
  //   2b7a456e-d6f2-4d69-b869-cfaf67c2eb65.stl00-1,-1,
  //   2b7a456e-d6f2-4d69-b869-cfaf67c2eb65.stl0-10,-1,
  //   2b7a456e-d6f2-4d69-b869-cfaf67c2eb65.stl010,-1,
  //   2b344b93-f454-4cf8-8a89-560e17ffab1a.stl100,-1,NO OVERHANG
  //   2b344b93-f454-4cf8-8a89-560e17ffab1a.stl-100,-1,NO OVERHANG
  //   2c8d0aa5-5e80-4a2c-aa8c-a43d592d279a.stl010,-1,
  //   2c54fb4a-9743-4060-ac1a-e8bad5c4714e,-1,
  //   2a28775f-3a23-45de-bd5a-92487b11c3aa.stl0-10,0,"NO OVERHANG, AXIS PERPENDICULAR TO PLATE"
  //   2a28775f-3a23-45de-bd5a-92487b11c3aa.stl010,0,"NO OVERHANG, AXIS PERPENDICULAR TO PLATE"
  //   2abb23f4-4911-4bbe-a52e-aca7dde555a3.stl0-10,0,"STABLE ORIENTATION, NO OVERHANG"
  //   2abb23f4-4911-4bbe-a52e-aca7dde555a3.stl010,0,"STABLE ORIENTATION, NO OVERHANG"
  //   2b9c4f99-c7c7-4f52-8648-d5c18e7b309d.stl0-10,0,"COMPLEX GEOMETRY, LESS OVERHANG THIS ORIENTATION, SMALLER Z AXIS"
  //   2b9c4f99-c7c7-4f52-8648-d5c18e7b309d.stl010,0,"COMPLEX GEOMETRY, LESS OVERHANG THIS ORIENTATION, SMALLER Z AXIS"
  //   2b73acdc-186f-45a4-b9fa-9c941a0e7cd0,0,
  //   2b73acdc-186f-45a4-b9fa-9c941a0e7cd0.stl00-1,0,
  //   2c8d0aa5-5e80-4a2c-aa8c-a43d592d279a.stl0-10,0,
  //   2c54fb4a-9743-4060-ac1a-e8bad5c4714e.stl00-1,0,
  //   2c68da46-dcdd-4a38-b6bb-623cfb1f8ea8,0,
  //   2a0ed5e0-24fc-4eee-8e6c-86993a622cb5,1,NO OVERHANG
  //   2a0ed5e0-24fc-4eee-8e6c-86993a622cb5.stl00-1,1,NO OVERHANG
  //   2a0ed5e0-24fc-4eee-8e6c-86993a622cb5.stl100,1,NO OVERHANG
  //   2a0ed5e0-24fc-4eee-8e6c-86993a622cb5.stl-100,1,NO OVERHANG
  //   2a254b41-eeb2-43b3-b1ba-b6b65ea5d301.stl100,1,"OVERHANG, MAY BE MORE STRUCTURALLY STRONG"
  //   2a254b41-eeb2-43b3-b1ba-b6b65ea5d301.stl-100,1,"OVERHANG, MAY BE MORE STRUCTURALLY STRONG"
  //   2a596d21-ff89-4f79-a51b-4d98ebdbb824,1,NO OVERHANG
  //   2a596d21-ff89-4f79-a51b-4d98ebdbb824.stl00-1,1,NO OVERHANG
  //   2a596d21-ff89-4f79-a51b-4d98ebdbb824.stl100,1,NO OVERHANG
  //   2a596d21-ff89-4f79-a51b-4d98ebdbb824.stl-100,1,NO OVERHANG
  //   2a666f7a-1353-4199-988d-5dc549d63bb8,1,"LESS OVERHANG, LARGE FIRST AREA"
  //   2a28775f-3a23-45de-bd5a-92487b11c3aa,1,"LARGE AREA, STABLE ORIENTATION"
  //   2a28775f-3a23-45de-bd5a-92487b11c3aa.stl00-1,1,"LARGE AREA, STABLE ORIENTATION"
  //   2a28775f-3a23-45de-bd5a-92487b11c3aa.stl100,1,"LARGE AREA, STABLE ORIENTATION"
  //   2a28775f-3a23-45de-bd5a-92487b11c3aa.stl-100,1,"LARGE AREA, STABLE ORIENTATION"
  //   2ab3dc7a-fa39-41db-9985-7ee700f7ab03,1,STRONGER IN THIS DIR
  //   2ab3dc7a-fa39-41db-9985-7ee700f7ab03.stl00-1,1,STRONGER IN THIS DIR
  //   2ab3dc7a-fa39-41db-9985-7ee700f7ab03.stl0-10,1,STRONGER IN THIS DIR
  //   2ab3dc7a-fa39-41db-9985-7ee700f7ab03.stl010,1,STRONGER IN THIS DIR
  //   2ab3dc7a-fa39-41db-9985-7ee700f7ab03.stl-100,1,"NO OVERHANG, AXIS FACING PLATE"
  //   2abb23f4-4911-4bbe-a52e-aca7dde555a3,1,"STABLE ORIENTATION, NO OVERHANG"
  //   2abb23f4-4911-4bbe-a52e-aca7dde555a3.stl00-1,1,"STABLE ORIENTATION, NO OVERHANG"
  //   2aed5d0b-dadc-42dd-ba82-5ef00cdd943f,1,"STABLE FIRST LAYER, NO OVERHANG"
  //   2aed5d0b-dadc-42dd-ba82-5ef00cdd943f.stl00-1,1,"STABLE FIRST LAYER, NO OVERHANG"
  //   2b7a456e-d6f2-4d69-b869-cfaf67c2eb65.stl100,1,"LESS OVERHANG, AXIS PERP TO PLATE"
  //   2b51b3e2-ceb4-4bb3-9e3a-3183f04b02b9.stl0-10,1,"NO EXTERNAL OVERHANG, AXIS PERP TO PLATE"
  //   2b51b3e2-ceb4-4bb3-9e3a-3183f04b02b9.stl010,1,"NO INTERNAL OVERHANG, AXIS PERP TO PLATE"
  //   2b344b93-f454-4cf8-8a89-560e17ffab1a,1,NO OVERHANG
  //   2b344b93-f454-4cf8-8a89-560e17ffab1a.stl00-1,1,NO OVERHANG
  //   2b84938c-df02-445d-b4d0-44efe98ee546.stl0-10,1,LARGE FIRST LAYER
  //   2b84938c-df02-445d-b4d0-44efe98ee546.stl010,1,LARGE FIRST LAYER
  //   2c4e2d0f-25bd-4a4d-9603-91c13d17180c.stl0-10,1,AXIS PERP TO PLATE
  //   2c4e2d0f-25bd-4a4d-9603-91c13d17180c.stl010,1,AXIS PERP TO PLATE
  //   2c8d0aa5-5e80-4a2c-aa8c-a43d592d279a,1,INCREASED STRENGTH IN THIS ORIENTATION
  //   2c8d0aa5-5e80-4a2c-aa8c-a43d592d279a.stl00-1,1,INCREASED STRENGTH IN THIS ORIENTATION
  //   2c8d0aa5-5e80-4a2c-aa8c-a43d592d279a.stl100,1,"LESS SUPPORT, GREATER FIRST LAYER"
  //   2c8d0aa5-5e80-4a2c-aa8c-a43d592d279a.stl-100,1,"LESS SUPPORT, GREATER FIRST LAYER"
  //   2c54fb4a-9743-4060-ac1a-e8bad5c4714e.stl100,1,LESS OVERHANG
  //   2c54fb4a-9743-4060-ac1a-e8bad5c4714e.stl-100,1,LESS OVERHANG
  //   2c68da46-dcdd-4a38-b6bb-623cfb1f8ea8.stl00-1,1,
  //   2c68da46-dcdd-4a38-b6bb-623cfb1f8ea8.stl0-10,1,LARGE SECTION AXIS PERP TO PLATE
  //   2c68da46-dcdd-4a38-b6bb-623cfb1f8ea8.stl010,1,LARGE SECTION AXIS PERP TO PLATE
  //   2c68da46-dcdd-4a38-b6bb-623cfb1f8ea8.stl100,1,LARGE AREA FIRST CONTACTING THE PLATE
  //   2c68da46-dcdd-4a38-b6bb-623cfb1f8ea8.stl-100,1,LARGE AREA FIRST CONTACTING THE PLATE
  //   2a0ed5e0-24fc-4eee-8e6c-86993a622cb5.stl0-10,2,"NO OVERHANG, LARGE AREA"
  //   2a0ed5e0-24fc-4eee-8e6c-86993a622cb5.stl010,2,"NO OVERHANG, LARGE AREA"
  //   2a5d8b29-580b-46da-8e59-4a4f1d2856e3.stl0-10,2,"HOLE FACING PLATE, NO OVERHANG"
  //   2a5d8b29-580b-46da-8e59-4a4f1d2856e3.stl010,2,"HOLE FACING PLATE, NO OVERHANG"
  //   2a8dc714-07ee-4db9-9430-c07923c85609.stl0-10,2,"NO OVERHANG, STABLE ORIENTATION"
  //   2a8dc714-07ee-4db9-9430-c07923c85609.stl010,2,"NO OVERHANG, STABLE ORIENTATION"
  //   2a39eb79-d6f3-4cd3-8d63-cd6f9e8a6c66.stl010,2,"NO OVERHANG, LARGE AREA"
  //   2a88ca51-9b3c-408c-9731-9ca3b021cd1b.stl0-10,2,"LARGE AREA, HOLE FACING PLATE"
  //   2a88ca51-9b3c-408c-9731-9ca3b021cd1b.stl010,2,"LARGE AREA, HOLE FACING PLATE"
  //   2a596d21-ff89-4f79-a51b-4d98ebdbb824.stl0-10,2,"NO OVERHANG, LARGE AREA"
  //   2a596d21-ff89-4f79-a51b-4d98ebdbb824.stl010,2,"NO OVERHANG, LARGE AREA"
  //   2a6458cf-ff3c-495d-b9eb-3ca8d6df94ee,2,"HOLE FACING PLATE, NO OVERHANG, STABLE"
  //   2a6458cf-ff3c-495d-b9eb-3ca8d6df94ee.stl00-1,2,"HOLE FACING PLATE, NO OVERHANG, STABLE"
  //   2a603729-d0a6-43b1-b1fc-ed3a171873a0.stl100,2,"LARGE FIRST LAYER, VERY STABLE"
  //   2a603729-d0a6-43b1-b1fc-ed3a171873a0.stl-100,2,"LARGE FIRST LAYER, VERY STABLE"
  //   2abb23f4-4911-4bbe-a52e-aca7dde555a3.stl100,2,LARGE FIRST LAYER AREA
  //   2abb23f4-4911-4bbe-a52e-aca7dde555a3.stl-100,2,LARGE FIRST LAYER AREA
  //   2aed5d0b-dadc-42dd-ba82-5ef00cdd943f.stl0-10,2,"MOST STABLE ORIENTATION, GOOD FIRST LAYER"
  //   2aed5d0b-dadc-42dd-ba82-5ef00cdd943f.stl010,2,"MOST STABLE ORIENTATION, GOOD FIRST LAYER"
  //   2aed5d0b-dadc-42dd-ba82-5ef00cdd943f.stl100,2,"MOST STABLE ORIENTATION, GOOD FIRST LAYER"
  //   2aed5d0b-dadc-42dd-ba82-5ef00cdd943f.stl-100,2,"MOST STABLE ORIENTATION, GOOD FIRST LAYER"
  //   2aefb65f-8a8d-4dd7-929a-9293e9958dab.stl100,2,"NO OVERHANG, STABLE"
  //   2aefb65f-8a8d-4dd7-929a-9293e9958dab.stl-100,2,"NO OVERHANG, STABLE"
  //   2b1a9001-a331-42df-a5d9-b1857d2e666a.stl100,2,"LARGE FIRST LAYER, AXIS FACING PLATE, NO OVERHANG"
  //   2b1a9001-a331-42df-a5d9-b1857d2e666a.stl-100,2,"LARGE FIRST LAYER, AXIS FACING PLATE, NO OVERHANG"
  //   2b4d7b78-27d6-4a9f-9dd0-84a71207f8fa.stl010,2,"LARGE HOLE AXIS PERP TO PLATE, LARGE FIRST LAYER AREA"
  //   2b73acdc-186f-45a4-b9fa-9c941a0e7cd0.stl0-10,2,"LARGE AREA, STABLE ORIENTATION, LOW Z AXIS, NO OVERHANG"
  //   2b73acdc-186f-45a4-b9fa-9c941a0e7cd0.stl010,2,"LARGE AREA, STABLE ORIENTATION, LOW Z AXIS, NO OVERHANG"
  //   2b344b93-f454-4cf8-8a89-560e17ffab1a.stl0-10,2,"STABLE FIRST LAYER, NO OVERHANG"
  //   2b344b93-f454-4cf8-8a89-560e17ffab1a.stl010,2,"STABLE FIRST LAYER, NO OVERHANG"
  //   2ba88e70-68f4-495b-be5b-3d4d5e3312d1.stl100,2,"AXIS PERP TO PLATE, NO OVERHANG"
  //   2ba88e70-68f4-495b-be5b-3d4d5e3312d1.stl-100,2,"AXIS PERP TO PLATE, NO OVERHANG"
  //   2c6c447c-50e5-441b-b976-cc0d0abe7bc2,2,"AXIS PERP TO PLATE, NO OVERHANG"
  //   2c6c447c-50e5-441b-b976-cc0d0abe7bc2.stl00-1,2,"AXIS PERP TO PLATE, NO OVERHANG"
  //   2c950e64-9868-40da-aca4-1c6396208df4.stl0-10,2,"AXIS PERP TO PLATE, NO OVERHANG"
  //   2c950e64-9868-40da-aca4-1c6396208df4.stl010,2,"AXIS PERP TO PLATE, NO OVERHANG"`;

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

    console.log(result);
    await importRatingsMutation.mutateAsync(result);
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
        <button onClick={handlePrintCsvData}>Sync</button>
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
