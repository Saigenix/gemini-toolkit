import { NextPage } from "next";
import { Center } from "@chakra-ui/react";
import { Link } from "@saas-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { PageTransition } from "components/motion/page-transition";
import { Section } from "components/section";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import { Heading } from "@chakra-ui/react";


const Profile: NextPage = () => {
const [user, loading, error] = useAuthState(auth);
  return (
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />
      <Center height="100%" pt="20">
        <Heading fontSize={24} as="h1" size="xl" mt={20} paddingBottom={5}>
          welcome {user?.displayName}
        </Heading>
      </Center>
    </Section>
  );
};

export default Profile;
