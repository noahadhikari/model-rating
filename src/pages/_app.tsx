// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import {
  ChakraProvider,
  extendTheme,
  theme as baseTheme,
} from "@chakra-ui/react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const colors = {
    primaryFontColor: {
      lightMode: baseTheme.colors.gray["700"],
      darkMode: baseTheme.colors.gray["200"],
    },
    secondaryFontColor: {
      lightMode: baseTheme.colors.gray["600"],
      darkMode: baseTheme.colors.gray["400"],
    },
    plainOldBlue: "blue",
  };

  const theme = extendTheme({
    colors,
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },

    components: {
      Text: {
        baseStyle: (props: any) => ({
          color: "black",
        }),
      },
    },

    styles: {
      global: () => ({
        body: {
          bg: "gray.200",
        },
      }),
    },
  });

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
