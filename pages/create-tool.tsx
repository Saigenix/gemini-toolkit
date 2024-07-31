"use client";
import * as React from "react";
import type { NextPage } from "next";
import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  Input,
  Tooltip,
  FormLabel,
  RadioGroup,
  Radio,
  Textarea,
  Button,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/router";
import { ReactFlow, Background, Controls } from "@xyflow/react";

const CreateTool: NextPage = () => {
  const { colorMode } = useColorMode();
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
    <Container maxW="container.xl" mt={16} p={4}>
      <BackgroundGradient height={400} zIndex="-1" />
      <Flex justifyContent="space-between" mb={4} alignItems="center">
        <Heading size="md"></Heading>
        <Button colorScheme="purple" onClick={() => (window.location.href = "/create-simple")}>
          Create Simple Tool
        </Button>
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
          <Heading size="md" mb={4}>
            Tool Details
          </Heading>
          <Box mb={4}>
            <Text mb={2}>Type</Text>
            <RadioGroup defaultValue="text">
              <Flex>
                <Radio value="text" mr={4}>
                  Text
                </Radio>
                <Radio value="image" mr={4}>
                  Image
                </Radio>
                <Radio value="both">Both</Radio>
              </Flex>
            </RadioGroup>
          </Box>
          <Box mb={4}>
            <Text mb={2}>Tool Name</Text>
            <Input placeholder="Enter tool name" />
          </Box>
          <Box mb={4}>
            <Text mb={2}>Description</Text>
            <Textarea placeholder="Enter description" />
          </Box>

          <Box mb={4}>
            <Text mb={2}>Additional</Text>
            <Textarea placeholder="Enter additional info" />
          </Box>
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
  );
};

export default CreateTool;

