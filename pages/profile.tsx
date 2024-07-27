"use client";
import * as React from "react";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faScrewdriverWrench,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { SlActionRedo, SlHeart } from "react-icons/sl";
import { BsBookmarkPlus } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import {
  Container,
  Box,
  ButtonGroup,
  Button,
  Icon,
  Heading,
  Text,
  Flex,
  Switch,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import { Highlights, HighlightsItem } from "components/highlights";
import { useState, useEffect } from "react";
import { getDocumentsByUserId } from "utils/firestore";
import { useRouter } from "next/router";
const Profile: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [documents, setDocuments] = useState<any>([]);
  const [loading1, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    const fetchData = async () => {
      console.log(user);
      if (user) {
        setLoading(true);
        try {
          const { data, error } = await getDocumentsByUserId(user.uid);
          if (error) throw error;
          console.log(data);
          setDocuments(data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);
  return (
    <Box>
      <SEO title="NexAI" description="Next Generation AI" />
      <Box display={{ base: "block", md: "flex" }}>
        <Box
          flex={{ base: "none", md: "1" }}
          textAlign={{ base: "center", md: "left" }}
        >
          <ExploreTools displayName={user?.displayName} />
        </Box>
        <Box flex={{ base: "none", md: "6" }} ml={{ base: 0, md: 10 }}>
          {loading1 ? (
            <Center height="100%" pt="20">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          ) : (
            <>
            <HighlightsSection highlightsData={documents} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ExploreTools = ({ displayName }: any) => {
  return (
    <Box position="relative" overflow="hidden" p={{ base: 4, md: 8 }}>
      <BackgroundGradient height={400} zIndex="-1" />
      <Container maxW="container.xl" textAlign={{ base: "center", md: "left" }}>
        <Heading
          fontSize={30}
          as="h1"
          size="xl"
          marginTop={20}
          paddingBottom={5}
        >
          Welcome{" "}
          <Heading fontSize={25} mt={3}>
            {displayName}
          </Heading>
        </Heading>
        <Button
          colorScheme="purple"
          size="lg"
          height="60px"
          width="200px"
          fontSize="20px"
          onClick={() => (window.location.href = "/create-tool")}
          mt={3}
        >
          Create Tool{" "}
          <FontAwesomeIcon
            style={{ marginLeft: "0.5rem" }}
            icon={faScrewdriverWrench}
          />
        </Button>
        <Heading
          fontWeight={0}
          fontSize={{ base: "15px", md: "20px" }}
          as="h2"
          size="lg"
          mt={10}
        >
          Your Tools{" "}
          <FontAwesomeIcon
            style={{ marginLeft: "0.5rem" }}
            icon={faArrowRightLong}
          />
        </Heading>
      </Container>
    </Box>
  );
};

const HighlightsSection = ({ highlightsData }) => {
  return (
    <Highlights>
      <p>{highlightsData.length} Tools</p>
      {highlightsData.map((highlight, index) => (
        <HighlightsItem key={index} title={highlight.toolName}>
          <Text color="muted" fontSize="lg">
            {highlight.description}
          </Text>
          <Flex justifyContent="space-between" alignItems="center" mt={3}>
            <ButtonGroup spacing={3} alignItems="center">
              <ButtonLink
                marginTop={2}
                colorScheme="primary"
                fontSize="1.2rem"
                width={110}
                height={45}
                href={"/tool?toolID=" + highlight.id}
              >
                Use{" "}
                <FontAwesomeIcon
                  style={{ marginLeft: "0.5rem" }}
                  icon={faArrowUpRightFromSquare}
                />
              </ButtonLink>
            </ButtonGroup>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mt={10}>
            <Flex alignItems="center">
              <Icon
                as={SlHeart}
                boxSize="1.2rem"
                cursor="pointer"
                marginRight="1.2rem"
              />
              <Icon
                as={SlActionRedo}
                boxSize="1.2rem"
                cursor="pointer"
                marginRight="1.2rem"
              />
              <Icon
                as={BsBookmarkPlus}
                boxSize="1.2rem"
                cursor="pointer"
                marginRight="1.2rem"
              />
            </Flex>
            <Flex alignItems="center">
              <Text mr={2}>{highlight.status ? "Public" : "Private"}</Text>
              <Switch
                isChecked={highlight.status}
                onChange={() => togglePublicPrivate(index)}
                colorScheme="purple"
              />
            </Flex>
          </Flex>
        </HighlightsItem>
      ))}
    </Highlights>
  );
};

const togglePublicPrivate = (index: number) => {
  console.log(`Toggled public/private status for tool at index: ${index}`);
};

export default Profile;
