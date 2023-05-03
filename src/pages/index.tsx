import type { NextPage } from "next";
import Layout from "./components/Layout/Layout";
import Landing from "./components/Layout/Landing";

const Home: NextPage = () => {
  return (
    <Layout>
      <Landing />
    </Layout>
  );
};

export default Home;
