"use client";
import * as React from "react";
import { css, keyframes } from "@emotion/react";
import geminiLogo from "../public/static/images/gemini.png";
import userLogo from "../public/static/images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Heading,
  Text,
  VStack,
  HStack,
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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import {
  faQuestionCircle,
  faToolbox,
  faWrench,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const ChatbotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  async function generateChatGemini(chatHistory, message) {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        parts: [{ text: message }],
      },
      {
        role: "model",
        parts: [{ text: "loading..." }],
      },
    ]);
    try {
      const response = await fetch("/api/geminichat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatHistory,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }
      const res = await response.json();
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].parts[0].text = res.content;
        return newMessages;
      });
    } catch (error) {
      console.error("Error calling API:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].parts[0].text =
          "An error occurred. Please try again.";
        return newMessages;
      });
    }
  }

  const sendMessage = async (message: string) => {
    const chatHistory = {
      history: messages,
      generationConfig: { maxOutputTokens: 500 },
    };
    setInputValue("");
    await generateChatGemini(chatHistory, message);
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

  const questionIcons = [faQuestionCircle, faToolbox, faWrench];
  const iconColors = ["#FF6347", "#4682B4", "#32CD32"];

  const preQuestions = [
    `How are you ?`,
    "How to use tool ?",
    "How to create tool ?",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent
        margin={{ base: "10px", sm: "20px", md: "30px" }}
        borderRadius="15px"
      >
        <ModalHeader textAlign={"center"}>Chat with Gemini Toolkit</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="400px" overflowY="auto">
          <Flex
            justify="space-between"
            textAlign="center"
            alignItems="center"
            mb={4}
            wrap="wrap"
          >
            {preQuestions.map((question, index) => (
              <Box
                key={index}
                as="button"
                w="50%"
                bg="#373A40"
                p={2}
                borderRadius="15px"
                boxShadow="lg"
                textAlign="left"
                onClick={() => setInputValue(question)}
                flexBasis={index === 2 ? "50%" : "45%"}
                mt={index === 2 ? 2 : 0}
                ml={index === 2 ? "auto" : 0}
                mr={index === 2 ? "auto" : 0}
              >
                <Flex align="center" justify="center">
                  <Text color="white" fontSize="sm" mr={2}>
                    {question}
                  </Text>
                  <FontAwesomeIcon
                    icon={questionIcons[index]}
                    color={iconColors[index]}
                  />
                </Flex>
              </Box>
            ))}
          </Flex>
          <VStack spacing={3} align="stretch">
            {messages.map((msg, index) => (
              <Box key={index} w="100%">
                {msg.role === "user" && (
                  <>
                    <Box display="flex" alignItems="center">
                      <Box
                        as="img"
                        src={userLogo.src}
                        alt="User Logo"
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
                      <Text color="black">{msg.parts[0].text}</Text>
                    </Box>
                  </>
                )}

                {msg.role === "model" && (
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
                      <Text color="white">{msg.parts[0].text}</Text>
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
                onKeyDown={onKeyDownHandler}
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

export default ChatbotModal;

