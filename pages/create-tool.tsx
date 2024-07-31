"use client";
import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  Input,
  Stack,
  Tooltip,
  FormLabel,
  RadioGroup,
  FormControl,
  Radio,
  Textarea,
  Button,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { faCircleQuestion, faCircleInfo, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/router";
import { ReactFlow, Background, Controls } from "@xyflow/react";

const CreateTool: NextPage = () => {
  const { colorMode } = useColorMode();
  const [type, setType] = useState("text");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [extraPrompt, setExtraPrompt] = useState("");
  const [additional, setAdditional] = useState("");

  const nodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "prompt" },
      type: "input",
      draggable: true,
    },
    {
      id: "2",
      position: { x: 100, y: 100 },
      data: { label: "prompt" },
    },
  ];

  const edges = [{ id: "1-2", source: "1", target: "2" }];

  return (
    <Box position="relative" overflow="hidden" p={{ base: 4, md: 8 }}>
      <BackgroundGradient height={400} zIndex="-1" />
      <Container maxW="container.xl" mt={10} p={4}>
        <Flex justifyContent="space-between" mb={4} alignItems="center">
          <Heading size="md">Tool Details</Heading>
          <Flex alignItems="center">
            <Button colorScheme="purple" onClick={() => (window.location.href = "/create-simple")}>
              Create Simple Tool
            </Button>
            <Tooltip label="How to create a simple tool" placement="bottom" hasArrow>
              <FontAwesomeIcon
                icon={faCircleInfo}
                style={{ marginLeft: 8, height: 25 }}
              />
            </Tooltip>
          </Flex>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          height={{ base: "auto", md: "calc(100vh - 160px)" }}
          minHeight="calc(100vh - 160px)"
          gap={4}
        >
          <Box
            width={{ base: "100%", md: "30%" }}
            padding={2}
            borderRight={{ base: "none", md: "0px solid #E2E8F0" }}
            mx={{ base: "auto", md: "0" }}
          >
            <FormControl mb={4}>
              <FormLabel pb={0} fontSize={15} mt={3}>Type</FormLabel>
              <RadioGroup onChange={setType} value={type}>
                <Stack direction="row">
                  <Radio value="text">Text</Radio>
                  <Radio value="img">Image</Radio>
                  <Radio value="both">Both</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0} fontSize={15} mt={3}>Name</FormLabel>
                <Tooltip label="You have to Enter Tool Name here" placement="right" hasArrow>
                  <FontAwesomeIcon style={{ marginTop: 1, height: 15 }} icon={faCircleQuestion} />
                </Tooltip>
              </Box>
              <Input
                placeholder="Enter tool name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0} fontSize={15} mt={3}>Description</FormLabel>
                <Tooltip label="You have to Enter Tool Description here" placement="right" hasArrow>
                  <FontAwesomeIcon style={{ marginTop: 1, height: 15 }} icon={faCircleQuestion} />
                </Tooltip>
              </Box>
              <Textarea
                placeholder="Enter description about tool"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0} fontSize={15} mt={3}>Additional</FormLabel>
                <Tooltip label="You have to enter additional details here" placement="right" hasArrow>
                  <FontAwesomeIcon style={{ marginTop: 1, height: 15 }} icon={faCircleQuestion} />
                </Tooltip>
              </Box>
              <Textarea
                placeholder="Enter the additional details here"
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
              />
            </FormControl>


          </Box>
          <Divider orientation="vertical" display={{ base: "none", md: "block" }} />
          <Box
            width={{ base: "100%", md: "70%" }}
            padding={2}
            mt={{ base: "4", md: "0" }}
            mx={{ base: "auto", md: "0" }}
            display={{ base: "block", md: "block" }}
            height={{ base: "400px", md: "100%" }}
          >
            <ReactFlow colorMode="dark" nodes={nodes} edges={edges} fitView>
              <Background />
              <Controls />
            </ReactFlow>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CreateTool;

