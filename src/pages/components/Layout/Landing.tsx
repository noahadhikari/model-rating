import { Box, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const Landing = () => {
  const session = useSession();

  if (!session) {
    return <h1>Please sign in</h1>;
  }

  return (
    <Box>
      <Text
        fontSize="5xl"
        fontWeight="semibold"
        textAlign="center"
        color="gray.900"
      >
        Welcome {session.data?.user?.name ?? ". Please sign in"}
      </Text>
      ;
    </Box>
  );
};

export default Landing;
