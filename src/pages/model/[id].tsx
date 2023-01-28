import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import ModelLayout from "../components/ModelLayout";
import Layout from "../components/Layout/Layout";
import { Text } from "@chakra-ui/react";

const ModelPage: NextPage = () => {
  const [success, setSuccess] = useState(true);

  const router = useRouter();
  const id = Number(router.query.id);

  const { isLoading, data: model } = trpc.model.getModel.useQuery(
    { id },
    {
      enabled: id !== undefined && !isNaN(id),
      refetchOnWindowFocus: false,
      onSuccess: (model) => {
        setSuccess(model !== null && model !== undefined);
      },
    }
  );
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!success) {
    return <Text>Model with id {id} doesn't exist.</Text>;
  }

  if (!model) {
	return <Text>Model not found</Text>;
  }

  return (
    <Layout>
      <ModelLayout model={model} />
    </Layout>
  );
};

export default ModelPage;
