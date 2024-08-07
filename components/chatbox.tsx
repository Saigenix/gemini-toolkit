"use client";
import * as React from "react";
import { css, keyframes } from "@emotion/react";
import geminiLogo from "../public/static/images/gemini.png";
import userLogo from "../public/static/images/profile.png";
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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";

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
    // console.log(chatHistory);
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
  //   const chatHistory = {
  //     history: [
  //       {
  //         role: "user",
  //         parts: [{ text: "Hello, I have 2 dogs in my house." }],
  //       },
  //       {
  //         role: "model",
  //         parts: [{ text: "Great to meet you. What would you like to know?" }],
  //       },
  //     ],
  //     generationConfig: {
  //       maxOutputTokens: 500,
  //     },
  //   };

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
                {msg.role === "user" && (
                  <>
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
