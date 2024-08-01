import * as React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Tooltip,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { auth } from "../utils/Auth";
import { SEO } from "components/seo/seo";
import { addSimpleTool } from "utils/firestore";
import { useRouter } from "next/router";

const CreateSimple: React.FC = () => {
  const toast = useToast();
  const [type, setType] = useState("text");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [extraPrompt, setExtraPrompt] = useState("");
  const [additional, setAdditional] = useState("");
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading]);

  const handleSubmit = async () => {
    if (!name || !description || !prompt) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const result = await addSimpleTool({
      additional,
      creatorName: user?.displayName || "",
      description,
      img: "https://example.com/image.jpg",
      prompts: [prompt],
      stars: 5,
      status: true,
      toolName: name,
      type,
      userId: user?.uid || "",
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Tool created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Document added with ID: ", result.id);

      setName("");
      setDescription("");
      setPrompt("");
      setType("text");
      setAdditional("");
    } else {
      toast({
        title: "Error",
        description: "Failed to create the tool.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to add document: ", result.error);
    }
  };

  return (
    <Box position="relative" overflow="hidden" p={{ base: 4, md: 8 }}>
      <BackgroundGradient height={400} zIndex="-1" />
      <SEO title="Create Tool" description="Create a new tool" />
      <Container maxW="container.md" mt={10}>
        <Heading as="h1" size="xl" mt={20} mb={5} textAlign="center">
          Create Simple Tool
        </Heading>
        <Box
          p={6}
          boxShadow="lg"
          rounded="md"
          bg="white"
          _dark={{ bg: "gray.800" }}
          mb={10}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0}>Name</FormLabel>
                <Tooltip
                  label="You have to Enter Tool Name here"
                  placement="right"
                  hasArrow
                >
                  <FontAwesomeIcon
                    style={{ marginBottom: 10, height: 15 }}
                    icon={faCircleQuestion}
                  />
                </Tooltip>
              </Box>
              <Input
                placeholder="Enter tool name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Type</FormLabel>
              <RadioGroup onChange={setType} value={type}>
                <Stack direction="row">
                  <Radio value="text">Text</Radio>
                  <Radio value="img">Image</Radio>
                  <Radio value="both">Both</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0}>Description</FormLabel>
                <Tooltip
                  label="You have to Enter Tool Description here"
                  placement="right"
                  hasArrow
                >
                  <FontAwesomeIcon
                    style={{ marginBottom: 10, height: 15 }}
                    icon={faCircleQuestion}
                  />
                </Tooltip>
              </Box>
              <Textarea
                placeholder="Enter the description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0}>Prompt</FormLabel>
                <Tooltip
                  label="You have to Enter Prompt to Create Your AI Tool"
                  placement="right"
                  hasArrow
                >
                  <FontAwesomeIcon
                    style={{ marginBottom: 10, height: 15 }}
                    icon={faCircleQuestion}
                  />
                </Tooltip>
              </Box>
              <Textarea
                placeholder="Enter the prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl mb={4} isRequired>
            <Box display="flex" alignItems="center">
              <FormLabel pb={0}>Additional</FormLabel>
              <Tooltip
                label="You Can Add Additional Content here"
                placement="right"
                hasArrow
              >
                <FontAwesomeIcon
                  style={{ marginBottom: 10, height: 15 }}
                  icon={faCircleQuestion}
                />
              </Tooltip>
            </Box>
            <Textarea
              placeholder="Enter additional information (optional)"
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
            />
          </FormControl>

          <Button colorScheme="purple" width="full" onClick={handleSubmit}>
            Create
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateSimple;
