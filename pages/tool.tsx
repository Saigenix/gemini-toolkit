"use client";
import { Link } from "@saas-ui/react";
import { flushSync } from "react-dom";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { PageTransition } from "components/motion/page-transition";
import { Section } from "components/section";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState, useCallback, useRef } from "react";
import { getDocumentUsingToolID } from "utils/firestore";
import { GenerateTextOutput } from "utils/gemini.js";
import * as React from "react";
import OtherOptions from "components/other-options";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Heading,
  Text,
  Center,
  IconButton,
  Textarea,
  Input,
  Tooltip,
  Flex,
  Spinner,
  Collapse,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { faCloudUploadAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import { MdVerified } from "react-icons/md";
import {
  faCircleQuestion,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadImageToFirebase } from "utils/firestore";

const ToolPage: NextPage = ({}: any) => {
  // const [user, loading, error] = useAuthState(auth);
  const [toolID, setToolID] = useState<string | null>(null);
  const [geminiOutput, setgeminiOutput] = useState<string[] | null[]>([]);
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState("");
  const [imgUrl, setimgUrl] = useState<String | null>(null);
  const [showResponses, setShowResponses] = useState<boolean[]>([]);
  const toast = useToast();
  const isFirstRun = useRef(true);

  useEffect(() => {
    const search = searchParams?.get("toolID");
    if (search) {
      setToolID(search);
    }
  }, [searchParams]);

  async function generateGemini(prompt, input) {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          input: input,
          type: document?.type,
          imgUrl: imgUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setgeminiOutput((prev) => [...prev, data.content]);
    } catch (error) {
      console.error("Error calling API:", error);
      setgeminiOutput(["Something went wrong!!!"]);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (toolID) {
        setLoading(true);
        try {
          const { data, error } = await getDocumentUsingToolID(toolID);
          // console.log(data, toolID);
          if (error) throw error;
          setDocument(data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [toolID]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      toast({
        title: `Uploading the image...`,
        status: "info",
        isClosable: true,
      });
      const result = await uploadImageToFirebase(file);
      toast.closeAll();
      if (result.success) {
        console.log("Image uploaded successfully. URL:", result.url);
        setimgUrl(result.url!);
        // You can now use result.url to store in Firestore or display the image
      } else {
        console.error("Failed to upload image:", result.error);
      }
    }
  };

  useEffect(() => {
    if (!isFirstRun.current) {
      const temprun = async () => {
        setContentLoading(true);
        console.log("current length", geminiOutput.length);
        if (document && geminiOutput.length == 0) {
          console.log(geminiOutput);
          await generateGemini(document.prompts[0], inputText);
        }
        setContentLoading(false);
      };
      temprun();
    } else {
      console.log("is first run");
      isFirstRun.current = false;
    }
    if (geminiOutput.length == 0) {
      return;
    }
    if (
      document &&
      geminiOutput.length > 0 &&
      geminiOutput.length < document.prompts.length
    ) {
      toast({
        title: `Generating Next Response...`,
        status: "info",
        isClosable: true,
      });
      const runNow = async () => {
        console.log(geminiOutput.length);
        await generateGemini(
          document.prompts[geminiOutput.length],
          geminiOutput[geminiOutput.length - 1]
        );
      };
      runNow();
      setShowResponses(geminiOutput.map(() => true));
    }
  }, [geminiOutput]);
  const handleSubmit = async () => {
    setgeminiOutput((prev) => []);
    if (document?.type === "text" && inputText === "") {
      alert("Please enter some text");
      return;
    }
    if (document?.type === "img" && imgUrl === null) {
      alert("Please upload an image");
      return;
    }
    if (document?.type === "both" && (imgUrl === null || inputText === "")) {
      alert("Please upload an image and enter some text");
      return;
    }
  };

  const toggleResponse = (index: number) => {
    setShowResponses((prev) => {
      const newShowResponses = [...prev];
      newShowResponses[index] = !newShowResponses[index];
      return newShowResponses;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied successfully!",
        status: "success",
        isClosable: true,
      });
    });
  };

  if (loading) {
    return (
      <Center height="100%" pt="20">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Flex direction="column" minHeight="100vh">
      <Box pt="120px">
        <BackgroundGradient height={400} zIndex="-1" />
        <SEO title="Tool Page" description="Tool Details" />
        <Box display={{ base: "block", md: "flex" }} p={4}>
          <Box
            flex={{ base: "none", md: "1" }}
            textAlign="left"
            borderRight="1px solid gray"
            pr={4}
          >
            <Heading
              fontSize={{ base: "20px", md: "24px" }}
              as="h2"
              size="lg"
              textAlign="left"
            >
              {document.toolName}
            </Heading>
            <Flex justifyContent="flex-start" alignItems="center" mt={3}>
              <Text
                fontSize={{ base: "14px", md: "18px" }}
                mr={2}
                opacity={0.8}
              >
                {document.creatorName}
              </Text>
              <MdVerified color="#06D001" size={20} style={{ marginTop: 0 }} />
            </Flex>
            <Text
              mt={3}
              fontSize={{ base: "16px", md: "18px" }}
              textAlign="left"
            >
              {document.description}
            </Text>
            <Flex>
              <OtherOptions toolId={document.id} stars={document.stars} />
            </Flex>
          </Box>

          <Box
            flex={{ base: "none", md: "3" }}
            ml={{ base: 0, md: 6 }}
            mt={{ base: 4, md: 0 }}
          >
            <Box mb={4}>
              {document.type === "text" && (
                <Box mb={4}>
                  <Flex>
                    <Text fontSize={18} fontWeight={600} pb={3}>
                      Enter Text
                    </Text>
                    <Tooltip
                      label={document.additional}
                      placement="right"
                      hasArrow
                    >
                      <FontAwesomeIcon
                        style={{ marginTop: 5, height: 15, marginLeft: 10 }}
                        icon={faCircleQuestion}
                      />
                    </Tooltip>
                  </Flex>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text..."
                    size="lg"
                  />
                  <Button
                    colorScheme="green"
                    size="lg"
                    onClick={handleSubmit}
                    mt={4}
                    isDisabled={inputText === "" || contentLoading}
                  >
                    Submit
                  </Button>
                </Box>
              )}
              {document.type === "img" && (
                <Box
                  mb={4}
                  display="flex"
                  flexDirection="column"
                  alignItems="left"
                >
                  <Box display="flex" alignItems="left" mb={4}>
                    <Button
                      as="label"
                      htmlFor="file-upload"
                      colorScheme="purple"
                      size="lg"
                    >
                      <FontAwesomeIcon icon={faCloudUploadAlt} />
                      &nbsp;Upload Image
                    </Button>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      display="none"
                    />
                    <Button
                      colorScheme="green"
                      size="lg"
                      onClick={handleSubmit}
                      ml={4}
                      isDisabled={imgUrl === null || contentLoading}
                    >
                      Submit
                    </Button>
                  </Box>
                  {imgUrl && (
                    <Flex
                      mt={4}
                      alignItems="center"
                      bg="green.100"
                      p={3}
                      borderRadius="md"
                      border="1px"
                      borderColor="green.200"
                      maxWidth={300}
                      justifyContent="center"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} color="green" />
                      <Text ml={2} fontWeight="bold" color="green.800">
                        Image uploaded successfully
                      </Text>
                    </Flex>
                  )}
                </Box>
              )}
              {document.type === "both" && (
                <Box mb={4}>
                  <Box mb={4}>
                    <Text fontSize={18} fontWeight={600} pb={3}>
                      Enter Text
                    </Text>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter your text"
                      size="lg"
                    />
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Button
                      as="label"
                      htmlFor="file-upload"
                      colorScheme="purple"
                      size="lg"
                    >
                      Upload Image &nbsp;
                      <FontAwesomeIcon icon={faCloudUploadAlt} />
                    </Button>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      display="none"
                    />
                    <Button
                      colorScheme="green"
                      size="lg"
                      onClick={handleSubmit}
                      isDisabled={
                        imgUrl === null || inputText === "" || contentLoading
                      }
                      ml={4}
                    >
                      Submit
                    </Button>
                  </Box>
                  {imgUrl && (
                    <Flex
                      mt={4}
                      alignItems="center"
                      bg="green.100"
                      p={3}
                      borderRadius="md"
                      border="1px"
                      borderColor="green.200"
                      maxWidth={300}
                      justifyContent="center"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} color="green" />
                      <Text ml={2} fontWeight="bold" color="green.800">
                        Image uploaded successfully
                      </Text>
                    </Flex>
                  )}
                </Box>
              )}
            </Box>
            <Box>
              {contentLoading ? (
                <Center height="100%" pt="20">
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="red.200"
                    color="blue.500"
                    size="lg"
                  />
                </Center>
              ) : (
                geminiOutput.map((response, index) => (
                  <Box
                    key={index}
                    mb={4}
                    p={4}
                    border="1px solid gray"
                    borderRadius="md"
                  >
                    <Heading
                      fontSize="lg"
                      mb={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        {index + 1 == geminiOutput.length ? "Final " : ""}
                        Response {index + 1}
                        <Button
                          marginLeft={3}
                          size="xs"
                          fontSize={15}
                          onClick={() => toggleResponse(index)}
                        >
                          {showResponses[index] ? "Hide" : "Show"}
                        </Button>
                      </Box>

                      <Box display="flex" alignItems="center">
                        <Box ml={4} display="flex" alignItems="center">
                          <Text
                            fontWeight={800}
                            fontSize={15}
                            display={{ base: "none", md: "inline" }}
                            mr={2}
                          >
                            Copy
                          </Text>
                          <IconButton
                            aria-label="Copy response"
                            icon={<FontAwesomeIcon icon={faCopy} />}
                            onClick={() => copyToClipboard(response)}
                            size="sm"
                          />
                        </Box>
                      </Box>
                    </Heading>

                    <Collapse in={showResponses[index]}>
                      <Box
                        height={300}
                        maxWidth={1000}
                        padding={5}
                        background="linear-gradient(135deg, rgba(128, 0, 128, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)"
                        overflowY="auto"
                        borderRadius={10}
                        sx={{
                          p: {
                            marginBottom: "1rem",
                            lineHeight: "1.6",
                          },
                          ul: {
                            marginBottom: "1rem",
                            paddingLeft: "2rem",
                          },
                          ol: {
                            marginBottom: "1rem",
                            paddingLeft: "2rem",
                          },
                          li: {
                            marginBottom: "0.5rem",
                          },
                          h1: {
                            fontSize: "2xl",
                            marginBottom: "0.5rem",
                          },
                          h2: {
                            fontSize: "xl",
                            marginBottom: "0.5rem",
                          },
                          h3: {
                            fontSize: "lg",
                            marginBottom: "0.5rem",
                          },
                          h4: {
                            fontSize: "md",
                            marginBottom: "0.5rem",
                          },
                          h5: {
                            fontSize: "sm",
                            marginBottom: "0.5rem",
                          },
                          h6: {
                            fontSize: "xs",
                            marginBottom: "0.5rem",
                          },
                          blockquote: {
                            padding: "1rem",
                            margin: "1rem 0",
                            borderLeft: "4px solid #ccc",
                            backgroundColor: "#f9f9f9",
                            fontStyle: "italic",
                          },
                        }}
                      >
                        <ReactMarkdown>{response}</ReactMarkdown>
                      </Box>
                    </Collapse>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default ToolPage;
