import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import CreateModel from "./components/CreateModel";
import CreateRating from "./components/CreateRating";

const Home: NextPage = () => {
  const syncMutation = trpc.model.syncModels.useMutation();
  async function handleSync() {
    await syncMutation.mutateAsync().then(() => {alert("Sync complete")});
  }
  return (
    <>
      <Head>
        <title>Model Rating</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button name="syncModels" onClick={handleSync}>
        Sync Models with Google Drive
      </button>
      <CreateModel />
    </>
  );
};

export default Home;
