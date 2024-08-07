import { NextPage } from "next";
import NextLink from "next/link";
import { Box, Center, Stack, Button, Text } from "@chakra-ui/react";
import { Features } from "components/features";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { Section } from "components/section";
import siteConfig from "data/config";
import { PageTransition } from "components/motion/page-transition";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoginWithGoogle } from "../utils/Auth";
import { FaGoogle } from "react-icons/fa";

const SignUp: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
  }

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

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
            {/* <NextLink href="/">
              <Box
                as={siteConfig.logo}
                width="160px"
                ms="4"
                mb={{ base: 0, lg: 16 }}
              />
            </NextLink> */}
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
            <Box
              width="100%"
              maxW="container.sm"
              pt="8"
              px={{ base: 4, lg: 8 }}
              textAlign="center"
            >
              <Text
                fontWeight="bold"
                fontSize="2xl"
                mb={6}
                mt={{ base: 4, lg: 0 }}
              >
                Sign Up to Gemini Toolkit
              </Text>
              <Button
                size="lg"
                colorScheme="purple"
                variant="solid"
                bg="primary.500"
                color="white"
                _hover={{ bg: "primary.600" }}
                leftIcon={<FaGoogle />}
                isLoading={isLoading}
                onClick={() => LoginWithGoogle()}
                width={{ base: "100%", md: "auto" }}
              >
                Sign Up with Google
              </Button>
            </Box>
          </Center>
        </Stack>
      </PageTransition>
    </Section>
  );
};

export default SignUp;

export const getStaticProps = () => {
  return {
    props: {
      header: {
        display: "none",
      },
      footer: {
        borderTopWidth: "1px",
      },
    },
  };
};


