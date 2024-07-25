import { NextPage } from "next";
import NextLink from "next/link";
import { Box, Center, Stack, Text } from "@chakra-ui/react";
import { Features } from "components/features";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { Section } from "components/section";
import siteConfig from "data/config";
import { PageTransition } from "components/motion/page-transition";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";
import { LoginWithGoogle } from "../utils/Auth";
import { Icons } from "../components/icons"
const SignUp: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router =  useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 3000)
  }
  useEffect(() => {
    // console.log(user)
    if(user){
      router.push("/")
  }},[user])
  return (
    <Section height="100vh" innerWidth="container.xl">
      <BackgroundGradient
        zIndex="-1"
        width={{ base: "full", lg: "50%" }}
        left="auto"
        right="0"
        borderLeftWidth="1px"
        borderColor="gray.200"
        _dark={{
          borderColor: "gray.700",
        }}
      />
      <PageTransition height="100%" display="flex" alignItems="center">
        <Stack
          width="100%"
          alignItems={{ base: "center", lg: "flex-start" }}
          spacing="20"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Box pe="20">
            <NextLink href="/">
              <Box
                as={siteConfig.logo}
                width="160px"
                ms="4"
                mb={{ base: 0, lg: 16 }}
              />
            </NextLink>
            <Features
              display={{ base: "none", lg: "flex" }}
              columns={1}
              iconSize={4}
              flex="1"
              py="0"
              ps="0"
              maxW={{ base: "100%", xl: "80%" }}
              features={siteConfig.signup.features.map((feature) => ({
                iconPosition: "left",
                variant: "left-icon",

                ...feature,
              }))}
            />
          </Box>
          <Center height="100%" flex="1">
            <Box width="container.sm" pt="8" px="8">
              <button
                disabled={isLoading}
                onClick={() => LoginWithGoogle()}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-5 pr-4 h-4 w-4" />
                )}{" "}
                Sign In with Google
              </button>
            </Box>
          </Center>
        </Stack>
      </PageTransition>
    </Section>
  );
};

export default SignUp;
