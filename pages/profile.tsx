"use client";
import * as React from "react";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faScrewdriverWrench,
  faArrowRightLong,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { SlActionRedo, SlHeart } from "react-icons/sl";
import { BsBookmarkPlus, BsHeartFill, BsHeart } from "react-icons/bs";
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
  IconButton,
  VStack,
  Switch,
  Flex,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import { Highlights, HighlightsItem } from "components/highlights";
import { useState, useEffect } from "react";
import { getDocumentsByUserId, updateDocumentStatus } from "utils/firestore";
import { useRouter } from "next/router";
import { GetAllData, saveTool } from "utils/firestore";

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
      if (user) {
        setLoading(true);
        try {
          const { data, error } = await getDocumentsByUserId(user.uid);
          if (error) throw error;
          setDocuments(data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, loading]);

  const togglePublicPrivate = async (
    index: number,
    id: string,
    status: boolean
  ) => {
    try {
      const result = await updateDocumentStatus(id, !status);
      if (result.success) {
        const updatedHighlights = [...documents];
        updatedHighlights[index].status = !status;
        setDocuments(updatedHighlights);
      } else {
        console.error("Failed to update status", result.error);
      }
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

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
        <Box flex={{ base: "none", md: "6" }} ml={{ base: 0, md: 10 }} mt={-5}>
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
            <HighlightsSection
              highlightsData={documents}
              togglePublicPrivate={togglePublicPrivate}
            />
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
          paddingBottom={0.5}
        >
          Welcome
        </Heading>
        <Text fontSize={20}>{displayName}</Text>
        <Button
          colorScheme="purple"
          size="lg"
          height="60px"
          width="200px"
          fontSize="20px"
          onClick={() => (window.location.href = "/create-tool")}
          mt={8}
        >
          Create Tool
          <FontAwesomeIcon
            style={{ marginLeft: "0.5rem" }}
            icon={faScrewdriverWrench}
          />
        </Button>
      </Container>
    </Box>
  );
};

const HighlightsSection = ({ highlightsData, togglePublicPrivate }) => {
  const router = useRouter();
  const [likes, setLikes] = React.useState<{ [key: string]: number }>({});
  const [saved, setSaved] = React.useState<{ [key: string]: boolean }>({});
  const [shareToolId, setShareToolId] = React.useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [link, setLink] = React.useState<string>("");
  const { hasCopied, onCopy } = useClipboard(link);
  const toast = useToast();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setLink(window.location.href);
    }
  }, []);

  const handleLike = (toolId: string) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [toolId]: (prevLikes[toolId] || 0) + 1,
    }));
  };

  const handleShare = (toolId: string) => {
    setShareToolId(toolId);
    if (navigator.share) {
      navigator
        .share({
          title: "Gemini ToolKit",
          url: `${window.location.origin}/tool?toolID=${toolId}`,
        })
        .catch(console.error);
    } else {
      onOpen();
    }
  };

  const handleSave = async (toolId: string) => {
    setSaved((prevSaved) => ({
      ...prevSaved,
      [toolId]: !prevSaved[toolId],
    }));

    if (!saved[toolId]) {
      try {
        await saveTool(toolId);
        toast({
          title: "Tool saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        console.error("Error saving tool:", error);
        toast({
          title: "Failed to save tool.",
          description: "An error occurred while saving the tool.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  return (
    <Box>
      <Heading
        fontWeight={500}
        fontSize={{ base: "15px", md: "20px" }}
        as="h2"
        size="lg"
        mt={20}
        textAlign={{ base: "center", md: "left" }}
      >
        Your Tools
        <FontAwesomeIcon
          style={{ marginLeft: "0.5rem", height: 20 }}
          icon={faArrowRightLong}
        />
      </Heading>
      <Text
        fontWeight={500}
        textAlign={{ base: "center", md: "left" }}
        mt={3}
        marginBottom={-15}
      >
        Total Tools: {highlightsData.length}
      </Text>
      <Highlights>
        {highlightsData.map((highlight, index) => (
          <HighlightsItem key={index} title={highlight.toolName}>
            <Icon
              as={FontAwesomeIcon}
              icon={faEdit}
              boxSize="1.2rem"
              position="absolute"
              top={9}
              right={4}
              cursor="pointer"
              onClick={() => router.push(`/edit-tool?toolID=${highlight.id}`)}
            />
            <Box position="relative">
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
                    href={`/tool?toolID=${highlight.id}`}
                  >
                    Use
                    <FontAwesomeIcon
                      style={{ marginLeft: "0.5rem" }}
                      icon={faArrowUpRightFromSquare}
                    />
                  </ButtonLink>
                </ButtonGroup>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mt={10}>
                <Flex alignItems="center">
                  <Flex alignItems="center" mr="1.2rem">
                    <Icon
                      as={likes[highlight.id] ? BsHeartFill : BsHeart}
                      boxSize="1.2rem"
                      cursor="pointer"
                      marginRight="0.5rem"
                      color={likes[highlight.id] ? "red" : ""}
                      onClick={() => handleLike(highlight.id)}
                    />
                    <Text fontSize="sm">
                      {likes[highlight.id] || 0}
                    </Text>
                  </Flex>
                  <Icon
                    as={SlActionRedo}
                    boxSize="1.2rem"
                    cursor="pointer"
                    marginRight="1.2rem"
                    onClick={() => handleShare(highlight.id)}
                  />
                  <Icon
                    as={BsBookmarkPlus}
                    boxSize="1.2rem"
                    cursor="pointer"
                    marginRight="1.2rem"
                    color={saved[highlight.id] ? "" : ""}
                    onClick={() => handleSave(highlight.id)}
                  />
                </Flex>
                <Flex alignItems="center">
                  <Text paddingLeft={8}>
                    {highlight.status ? "Public" : "Private"}
                  </Text>
                  <Switch
                    paddingLeft={2}
                    isChecked={highlight.status}
                    onChange={() =>
                      togglePublicPrivate(index, highlight.id, highlight.status)
                    }
                    colorScheme="green"
                  />
                </Flex>
              </Flex>
            </Box>
          </HighlightsItem>
        ))}
      </Highlights>
    </Box>
  );
};

export default Profile;
