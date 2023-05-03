import { Flex, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const Landing = () => {
  const session = useSession();

  const getLandingText = () => {
    if (session.status === "authenticated") {
      return "Welcome " + session.data?.user?.name;
    } else if (session.status === "loading") {
      return "Loading...";
    } else {
      return "Welcome. Please sign in";
    }
  };
  
  return (
    <Flex justifyContent='center'>
      <Text
        fontSize="5xl"
        fontWeight="semibold"
        textAlign="center"
        color="gray.900"
      >
        {getLandingText()}
      </Text>
    </Flex>
  );
};

export default Landing;
