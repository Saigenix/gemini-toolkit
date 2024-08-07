"use client";
import * as React from "react";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCommentDots,
  faUser,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import OtherOptions from "components/other-options";
import { css, keyframes } from "@emotion/react";
import geminiLogo from "../public/static/images/gemini.png";
import userLogo from "../public/static/images/profile.png";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Heading,
  Text,
  VStack,
  Flex,
  Spinner,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import { Highlights, HighlightsItem } from "components/highlights";
import { GetAllData, saveTool, updateStars } from "utils/firestore";
import { auth } from "../utils/Auth";
import { MdVerified } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useRef } from "react";

const Home: NextPage = () => {
  const [user, loginLoading, error] = useAuthState(auth);
  const [tools, setTools] = React.useState<any[]>([]);
  const [filteredTools, setFilteredTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    GetAllData().then((data) => {
      setTools(data);
      setFilteredTools(data);
      setLoading(false);
    });
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
      box-shadow: 0 0 1px #805AD5;
    }
    50% {
      border-color: #B794F4;
      box-shadow: 0 0 10px #B794F4;
    }
    100% {
      border-color: #805AD5;
      box-shadow: 0 0 1px #805AD5;
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
            sx={{ animation: `${glowing} 2s infinite` }}
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
            _hover={{ bgGradient: "linear(to-r, blue.600, purple.600)" }}
            borderRadius="full"
            onClick={handleClick}
            size="lg"
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
        <IconButton
          aria-label="Chatbot"
          icon={<FontAwesomeIcon icon={faCommentDots} />}
          position="fixed"
          bottom="40px"
          right="20px"
          colorScheme="purple"
          borderRadius="full"
          size="lg"
          onClick={onOpen}
        />
        <ChatbotModal isOpen={isOpen} onClose={onClose} />
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
          <OtherOptions toolId={highlight.id} stars={highlight.stars} />
        </HighlightsItem>
      ))}
    </Highlights>
  );
};

const ChatbotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = React.useState<
    { user: string; bot: string }[]
  >([]);
  const [inputValue, setInputValue] = React.useState("");

  const sendMessage = async (message: string) => {
    const newMessages = [...messages, { user: message, bot: "" }];
    setMessages(newMessages);
    setInputValue("");

    setTimeout(() => {
      const botResponse = "This is a mock response from the chatbot.";
      setMessages([...newMessages, { user: message, bot: botResponse }]);
    }, 1000);
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const circularMotion = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chat with Gemini Toolkit</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="400px" overflowY="auto">
          <VStack spacing={3} align="stretch">
            {messages.map((msg, index) => (
              <Box key={index} w="100%">
                <Box display="flex" alignItems="center">
                  <Box
                    as="img"
                    src={userLogo.src}
                    alt="Gemini Logo"
                    boxSize="1.6rem"
                  />
                  <Text padding={2} fontWeight="bold">
                    You
                  </Text>
                </Box>
                <Box
                  mb={2}
                  ml="30px"
                  bg="white"
                  p={2}
                  borderRadius="15px"
                  boxShadow="lg"
                >
                  <Text color="black">{msg.user}</Text>
                </Box>
                {msg.bot && (
                  <>
                    <Box display="flex" alignItems="center">
                      <Box
                        as="img"
                        src={geminiLogo.src}
                        alt="Gemini Logo"
                        boxSize="1.6rem"
                        css={css`
                          animation: ${circularMotion} 4s linear infinite;
                          filter: saturate(2);
                        `}
                      />
                      <Text padding={2} fontWeight="bold">
                        Gemini
                      </Text>
                    </Box>
                    <Box
                      mb={2}
                      ml="30px"
                      bg="#6F61C0"
                      p={2}
                      borderRadius="15px"
                      boxShadow="lg"
                    >
                      <Text color="white">{msg.bot}</Text>
                    </Box>
                  </>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
            <Flex mt={4}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
              />
              <Button
                bg={"#6F61C0"}
                ml={2}
                color="white"
                onClick={() => sendMessage(inputValue)}
              >
                Send
              </Button>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Home;
