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
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import { Highlights, HighlightsItem } from "components/highlights";
import { useState, useEffect } from "react";
import { getDocumentsByUserId, updateToolStatus, deleteTool } from "utils/firestore";
import { useRouter } from "next/router";
import { GetAllData, saveTool } from "utils/firestore";
// import { id } from "date-fns/locale";
import ToolBoxProfile from "components/tool-box-profile";
const Profile: NextPage = () => {
  const toast = useToast();
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
 const HandleDelete = async (id: string) => {
   try {
     const result = await deleteTool(id);
     if (result.success) {
       setDocuments(documents.filter((doc) => doc.id !== id));
       toast({
         title: "Success",
         description: `Tool deleted successfully`,
         status: "success",
         duration: 5000,
         isClosable: true,
       });
     }
   } catch (error) {
     toast({
       title: "Error",
       description: `Failed to delete tool`,
       status: "error",
       duration: 5000,
       isClosable: true,
     });
     console.error(error);
   }
 };
  return (
    <Box>
      <SEO title="Gemini Toolkit" description="Next Generation AI" />
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
              HandleDelete={HandleDelete}
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

const HighlightsSection = ({ highlightsData,HandleDelete }) => {
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
    <Flex direction="column" minHeight="100vh">
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
          Total Tools : {highlightsData.length}
        </Text>
        <Highlights>
          {highlightsData.map((highlight, index) => (
            <ToolBoxProfile key={index} highlight={highlight} index={index} HandleDelete={HandleDelete} />
          ))}
        </Highlights>
      </Box>
    </Flex>
  );
};

export default Profile;


