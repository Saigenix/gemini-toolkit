"use client";
import { NextPage } from "next";
import { Center, Spinner,Box } from "@chakra-ui/react";
import { Link } from "@saas-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { PageTransition } from "components/motion/page-transition";
import { Section } from "components/section";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import { Heading } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getDocumentUsingToolID } from "utils/firestore";
import { GenerateTextOutput } from "utils/gemini.js";

const Tool: NextPage = ({}: any) => {
  // const [user, loading, error] = useAuthState(auth);
  const [toolID, setToolID] = useState<string | null>(null);
  const [geminiOutput, setgeminiOutput] = useState<string | null>("default");
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

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


  return (
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />
      <Center height="100%" pt="20">
        <Heading fontSize={24} as="h1" size="xl" mt={0} paddingBottom={10}>
          {/* use {data.toolName} */}tool
        </Heading>

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
        ) : (
          <>
            <p>{document.creatorName}</p>
            <Box>
            <p>{geminiOutput}</p>
            </Box>
          </>
        )}
      </Center>
    </Section>
  );
};

export default Tool;
