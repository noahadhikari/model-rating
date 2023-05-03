import { signIn, signOut, useSession } from "next-auth/react";
import { Box, Flex, Stack, Text, Divider, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Router from "next/router";

const HeaderBar = () => {
  const session = useSession();
  const nextFewestRated = trpc.model.getFewestRatedModel.useQuery({}, {
    refetchOnWindowFocus: false,
  });

  const getSignInComponent = () => {
    if (session?.status === "authenticated") {
      return (
        <Text
          color="gray.200"
          fontWeight="semibold"
          className="hover-cursor"
          onClick={() => signOut()}
        >
          Sign Out
        </Text>
      );
    } else if (session?.status === "loading") {
      return;
    } else {
      return (
        <Text
          color="gray.200"
          fontWeight="semibold"
          className="hover-cursor"
          onClick={() => signIn("google")}
        >
          Sign in
        </Text>
      );
    }
  };

  const handleNextFewestRated = () => {
    const id = nextFewestRated.data?.id;
    if (!id) return;
    Router.push(`/model/${id}`);
  };

  return (
    <Box bg="gray.800" boxShadow="0 0 2px #4a4a4a" fontSize="md">
      <Flex
        pl={4}
        pr={4}
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex>
          <Link href="/">
            <Text
              className="hover-cursor"
              mt={2}
              fontWeight="semibold"
              fontSize="xl"
              color="gray.200"
            >
              Model Rating
            </Text>
          </Link>
          <Divider orientation="vertical" height="50px" ml={4} />
        </Flex>

        <Flex alignItems="center" display={["none", "none", "flex", "flex"]}>
          <Stack direction="row" spacing={5} alignItems="center">
            <Spinner hidden={session && !!nextFewestRated.data} />
            <Text
              color="gray.200"
              onClick={handleNextFewestRated}
              hidden={!session || !nextFewestRated.data}
              className="hover-cursor"
            >
              Rate Models
            </Text>
            {getSignInComponent()}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HeaderBar;
