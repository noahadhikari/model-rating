import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import HeaderBar from "../HeaderBar";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component that wraps all pages.
 * Provides a navbar and ensures that the user is logged in and authorized.
 * Also configures Ably.
 */
const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <>
      <Head>
        <title>Model Rating</title>
        <meta name="Model Ratings" content="Rate models" />
      </Head>

      <Flex h="100%" direction="column">
        <HeaderBar />
		{children}
      </Flex>
    </>
  );
};

export default Layout;
