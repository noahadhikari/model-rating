import { Box, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const Landing = () => {
  const session = useSession();

  const getLandingText = () => {
    if (!session || session.status === "unauthenticated") {
      return "Welcome. Please sign in";
    } else if (session.status === "loading") {
      return "Loading...";
    } else {
      return "Welcome " + session.data?.user?.name;
    }
  };

  const landingText = getLandingText();

  return (
    <Box>
      <Text
        fontSize="5xl"
        fontWeight="semibold"
        textAlign="center"
        color="gray.900"
      >
        {landingText}
      </Text>
      ;
    </Box>
  );
};

export default Landing;
