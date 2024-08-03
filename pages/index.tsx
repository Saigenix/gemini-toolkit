"use client";
import * as React from "react";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { SlActionRedo, SlHeart } from "react-icons/sl";
import { BsBookmarkPlus, BsHeartFill, BsHeart } from "react-icons/bs";
import { css, keyframes } from "@emotion/react";
import geminiLogo from "../public/static/images/gemini.png";
import { useRouter } from "next/router";
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
  Flex,
  Spinner,
  Center,
  Input,
  InputGroup,
  InputRightElement,
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
import { GetAllData, saveTool } from "utils/firestore";
import { requestPermission } from "utils/firebase-messaging";
import { MdVerified } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";

const Home: NextPage = () => {
  const [user, loginLoading, error] = useAuthState(auth);
  const [tools, setTools] = React.useState<any[]>([]);
  const [filteredTools, setFilteredTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    GetAllData().then((data) => {
      console.log(data);
      setTools(data);
      setFilteredTools(data);
      setLoading(false);
    });
    // requestPermission();
  }, []);

  const handleClick = () => {
    if (user) router.push("/create-tool");
    else router.push("/signup");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredTools(tools);
    } else {
      setFilteredTools(
        tools.filter(
          (tool) =>
            tool.toolName.toLowerCase().includes(term) ||
            tool.description.toLowerCase().includes(term)
        )
      );
    }
  };

  const glowing = keyframes`
  0% {
    border-color: #805AD5;
    box-shadow: 0 0 2px #805AD5;
  }
  50% {
    border-color: #B794F4;
    box-shadow: 0 0 10px #B794F4;
  }
  100% {
    border-color: #805AD5;
    box-shadow: 0 0 2px #805AD5;
  }
`;

  return (
    <Box>
      <SEO title="Gemini ToolKit" description="Next Generation AI" />
      <Box>
        <ExploreTools />
        <Container maxW="container.xl" textAlign="center" pb={-3}>
          <InputGroup
            size="md"
            maxW="lg"
            mx="auto"
            mt={0}
            borderRadius="full"
            borderColor="purple.500"
            boxShadow="md"
            sx={{
              animation: `${glowing} 2s infinite`,
            }}
          >
            <Input
              pr="4.5rem"
              padding={5}
              placeholder="Search Tools"
              value={searchTerm}
              onChange={handleSearch}
              borderRadius="full"
              focusBorderColor="purple.500"
            />
            <InputRightElement width="4.5rem" />
          </InputGroup>
          <Button
            mt={10}
            color="white"
            cursor="pointer"
            bgGradient="linear(to-r, blue.500, purple.500)"
            _hover={{
              bgGradient: "linear(to-r, blue.600, purple.600)",
            }}
            // borderRadius="full"
            onClick={handleClick}
            size="lg"
            // sx={{
            //   animation: `${glowing} 2s infinite`,
            // }}
          >
            Create Tool
          </Button>
        </Container>
        {loading ? (
          <Center height="100%" pt="20">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        ) : null}
        <HighlightsSection tools={filteredTools} />
      </Box>
    </Box>
  );
};

const ExploreTools: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height={400} zIndex="-1" />
      <Container maxW="container.xl" textAlign="center" pb={1}>
        <Heading fontSize={35} as="h1" size="xl" mt={20} paddingBottom={5}>
          Explore AI Tools
        </Heading>
      </Container>
    </Box>
  );
};

const HighlightsSection = ({ tools }: any) => {
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

  const circularMotion = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

  return (
    <Highlights paddingTop={10}>
      {tools.map((highlight, index) => (
        <HighlightsItem
          key={index}
          title={highlight.toolName}
          position="relative"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          minHeight="250px"
        >
          <Box>
            <Box display="flex" alignItems="center" mt={-6}>
              <Text fontWeight={400} fontSize="lg" mr={2}>
                {highlight.creatorName}
              </Text>
              <MdVerified color="#06D001" size={20} />
            </Box>
            <Text mt={5} color="muted" fontSize="lg">
              {highlight.description}
            </Text>
          </Box>

          <Box
            as="img"
            src={geminiLogo.src}
            alt="Gemini Logo"
            boxSize="1.6rem"
            position="absolute"
            top={0}
            right={0}
            margin={2}
            css={css`
              animation: ${circularMotion} 4s linear infinite;
              filter: saturate(2);
            `}
          />

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
                Use{" "}
                <FontAwesomeIcon
                  style={{ marginLeft: "0.5rem" }}
                  icon={faArrowUpRightFromSquare}
                />
              </ButtonLink>
            </ButtonGroup>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mt={10}>
            <Flex alignItems="center" mr="1.2rem">
              <Icon
                as={likes[highlight.id] ? BsHeartFill : BsHeart}
                boxSize="1.2rem"
                cursor="pointer"
                marginRight="0.5rem"
                color={likes[highlight.id] ? "red" : ""}
                onClick={() => handleLike(highlight.id)}
              />
              <Text fontSize="sm">{likes[highlight.id] || 0}</Text>
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
        </HighlightsItem>
      ))}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Tool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ButtonGroup spacing={4}>
              <Button
                colorScheme="whatsapp"
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${window.location.origin}/tool?toolID=${shareToolId}`
                    )}`,
                    "_blank"
                  )
                }
              >
                WhatsApp
              </Button>
              <Button
                colorScheme="linkedin"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      `${window.location.origin}/tool?toolID=${shareToolId}`
                    )}`,
                    "_blank"
                  )
                }
              >
                LinkedIn
              </Button>
              <Button
                colorScheme="red"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/?url=${encodeURIComponent(
                      `${window.location.origin}/tool?toolID=${shareToolId}`
                    )}`,
                    "_blank"
                  )
                }
              >
                Instagram
              </Button>
              <Button onClick={onCopy}>
                {hasCopied ? "Link Copied" : "Copy Link"}
              </Button>
            </ButtonGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Highlights>
  );
};

export default Home;
