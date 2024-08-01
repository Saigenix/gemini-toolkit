import type { AppProps } from "next/app";
import { SaasProvider } from "@saas-ui/react";
import { Layout } from "components/layout";
import "app/globals.css";
import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  const { announcement, header, footer } = pageProps;

  return (
    <SaasProvider theme={theme}>
        <Layout
          announcementProps={announcement}
          headerProps={header}
          footerProps={footer}
        >
          <Component {...pageProps} />
        </Layout>
    </SaasProvider>
  );
}

export default MyApp;
