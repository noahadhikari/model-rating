import type { NextPage } from "next";
import Head from "next/head";
import CreateModel from "./components/CreateModel";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Model Rating</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateModel />
    </>
  );
};

export default Home;

