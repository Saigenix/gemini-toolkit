"use client";
import { Link } from "@saas-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { PageTransition } from "components/motion/page-transition";
import { Section } from "components/section";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getDocumentUsingToolID } from "utils/firestore";
import { GenerateTextOutput } from "utils/gemini.js";
import * as React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Button, Heading, Text, Center, Textarea, Input, Spinner, Collapse, FormLabel } from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const ToolPage: NextPage = ({}: any) => {
  // const [user, loading, error] = useAuthState(auth);
  const [toolID, setToolID] = useState<string | null>(null);
  const [geminiOutput, setgeminiOutput] = useState<string | null>("default");
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [showResponses, setShowResponses] = useState<boolean[]>([]);
  const router = useRouter();

  useEffect(() => {
    const search = searchParams?.get("toolID");
    if (search) {
      setToolID(search);
    }
  }, [searchParams]);

  async function generateGemini() {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: document?.prompts, input:"about sai", type: document?.type }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setgeminiOutput(data.content);
    } catch (error) {
      console.error("Error calling API:", error);
      setgeminiOutput("Error occurred");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (toolID) {
        setLoading(true);
        try {
          const { data, error } = await getDocumentUsingToolID(toolID);
          console.log(data, toolID);
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
  useEffect(() => {
    if (document) {
      generateGemini();
    }}, [document]);

  const toolData = {
    toolName: "Tool Name",
    description: "This is an example tool description.",
    toolType: "both",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const newResponses = ["Response from Gemini"];
    setResponses(newResponses);
    setShowResponses(newResponses.map(() => false));
  };

  const toggleResponse = (index: number) => {
    setShowResponses((prev) => {
      const newShowResponses = [...prev];
      newShowResponses[index] = !newShowResponses[index];
      return newShowResponses;
    });
  };

  if (loading) {
    return (
      <Center height="100%" pt="20">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box pt="120px">
      <BackgroundGradient height={400} zIndex="-1" />
      <SEO title="Tool Page" description="Tool Details" />
      <Box display={{ base: "block", md: "flex" }} p={4}>
        <Box flex={{ base: "none", md: "1" }} textAlign={{ base: "center", md: "left" }} borderRight="1px solid gray" pr={{ md: 4 }}>
          <Heading fontSize={{ base: "20px", md: "24px" }} as="h2" size="lg" mt={5}>
            {toolData.toolName}
          </Heading>
          <Text mt={3} fontSize={{ base: "16px", md: "18px" }}>
            {toolData.description}
          </Text>
        </Box>

        <Box flex={{ base: "none", md: "3" }} ml={{ base: 0, md: 6 }} mt={{ base: 4, md: 0 }}>
          <Box mb={4}>
            {toolData.toolType === "text" && (
              <Box mb={4}>
                <Text fontSize={18} fontWeight={600} pb={3}>Enter Text</Text>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text..."
                  size="lg"
                />
                <Button colorScheme="green" size="lg" onClick={handleSubmit} mt={4}>
                  Submit
                </Button>
              </Box>
            )}
            {toolData.toolType === "image" && (
              <Box mb={4} display="flex" alignItems="center">
                <Button as="label" htmlFor="file-upload" colorScheme="purple" size="lg">
                  <FontAwesomeIcon icon={faCloudUploadAlt} />
                  &nbsp;Upload Image
                </Button>
                <Input id="file-upload" type="file" onChange={handleFileChange} display="none" />
                <Button colorScheme="green" size="lg" onClick={handleSubmit} ml={4}>
                  Submit
                </Button>
              </Box>
            )}
            {toolData.toolType === "both" && (
              <Box mb={4}>
                <Box mb={4}>
                  <Text fontSize={18} fontWeight={600} pb={3}>Enter Text</Text>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text"
                    size="lg"
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  <Button as="label" htmlFor="file-upload" colorScheme="purple" size="lg">
                    Upload Image &nbsp;
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </Button>
                  <Input id="file-upload" type="file" onChange={handleFileChange} display="none" />
                  <Button colorScheme="green" size="lg" onClick={handleSubmit} ml={4}>
                    Submit
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
          <Box>
            {responses.map((response, index) => (
              <Box key={index} mb={4} p={4} border="1px solid gray" borderRadius="md">
                <Heading fontSize="lg" mb={2}>
                  Response {index + 1}
                  <Button size="xs" ml={4} onClick={() => toggleResponse(index)}>
                    {showResponses[index] ? "Hide" : "Show"}
                  </Button>
                </Heading>
                <Collapse in={showResponses[index]}>
                  <Textarea value={response} isReadOnly size="lg" />
                </Collapse>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ToolPage;


