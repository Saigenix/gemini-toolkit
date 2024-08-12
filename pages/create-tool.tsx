"use client";
import * as React from "react";
import { useState, useCallback } from "react";
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
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Alert,
  AlertIcon,
  Divider,
  useColorMode,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BackgroundGradient } from "components/gradients/background-gradient";
import {
  faCircleQuestion,
  faCircleInfo,
  faQuestion,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore } from "utils/store";
import InputF from "components/nodes/input";
import Prompt from "components/nodes/prompt";
import Out from "components/nodes/output";
import isAuth from "hooks/isAuth";
import { addSimpleTool } from "utils/firestore";
import { useRouter } from "next/router";

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  addPrompt: () => store.createNode("prompt"),
  addInput: () => store.createNode("input"),
  makeEmpty: () => store.makeEmpty(),
});

const nodeTypes = { input: InputF, prompt: Prompt, out: Out };

const CreateTool: NextPage = ({ user }: any) => {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [additional, setAdditional] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const store = useStore(selector, shallow);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createdToolId, setCreatedToolId] = useState("");

  const handleSubmit = async () => {
    const promptsArr: any = [];
    var inputType = "text";
    store.nodes.forEach((node) => {
      if (node.type === "prompt") {
        promptsArr.push(node.data?.text!);
      }
      if (node.type === "input") {
        inputType = node.data?.type;
      }
    });
    // console.log(promptsArr, inputType)

    const checkEmpty = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
          return true;
        }
      }
      return false;
    };

    if (!name || !description || checkEmpty(promptsArr)) {
      toast({
        title: "Error",
        description: "Please fill out all Prompt fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsCreating(true);

    const result = await addSimpleTool({
      additional,
      creatorName: user?.displayName || "",
      description,
      img: "https://example.com/image.jpg",
      prompts: promptsArr,
      stars: 5,
      status: false,
      toolName: name,
      type: inputType,
      userId: user?.uid || "",
    });

    setIsCreating(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Tool created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // console.log("Document added with ID: ", result.id);

      if (result.id) {
        setCreatedToolId(result.id);
        onOpen();
      }

      setName("");
      setDescription("");
      setAdditional("");
      store.makeEmpty();
    } else {
      toast({
        title: "Error",
        description: "Failed to create the tool.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // console.error("Failed to add document: ", result.error);
    }
  };

  const handleUseTool = () => {
    router.push(`/tool?toolID=/${createdToolId}`);
  };

  const isFormValid = name && description;

  return (
    <Box position="relative" overflow="hidden" p={{ base: 4, md: 8 }}>
      <BackgroundGradient height={400} zIndex="-1" />
      <Container maxW="container.xl" mt={12} p={4}>
        <Flex justifyContent="space-between" mb={4} alignItems="center">
          <Heading size="md">Tool Details</Heading>
          <Flex alignItems="center">
            <Button
              colorScheme="purple"
              onClick={() => (window.location.href = "/create-simple")}
            >
              Create Simple Tool
            </Button>
            <Tooltip
              label="You can create simple tool from here"
              placement="bottom"
              hasArrow
            >
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
            {/* <FormControl mb={4}>
              <FormLabel pb={0} fontSize={15} mt={3}>
                Type
              </FormLabel>
              <RadioGroup onChange={setType} value={type}>
                <Stack direction="row">
                  <Radio value="text">Text</Radio>
                  <Radio value="img">Image</Radio>
                  <Radio value="both">Both</Radio>
                </Stack>
              </RadioGroup>
            </FormControl> */}

            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0} fontSize={15} mt={3}>
                  Name
                </FormLabel>
                <Tooltip
                  label="You have to Enter Tool Name here"
                  placement="right"
                  hasArrow
                >
                  <FontAwesomeIcon
                    style={{ marginTop: 1, height: 15 }}
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

            <FormControl isRequired>
              <Box display="flex" alignItems="center">
                <FormLabel pb={0} fontSize={15} mt={3}>
                  Description
                </FormLabel>
                <Tooltip
                  label="You have to Enter Tool Description here"
                  placement="right"
                  hasArrow
                >
                  <FontAwesomeIcon
                    style={{ marginTop: 1, height: 15 }}
                    icon={faCircleQuestion}
                  />
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
                <FormLabel pb={0} fontSize={15} mt={3}>
                  Additional
                </FormLabel>
                <Tooltip
                  label="You have to enter additional details here"
                  placement="right"
                  hasArrow
                >
                  <FontAwesomeIcon
                    style={{ marginTop: 1, height: 15 }}
                    icon={faCircleQuestion}
                  />
                </Tooltip>
              </Box>
              <Textarea
                placeholder="Enter the additional details here"
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
              />
            </FormControl>

            <Button
              colorScheme="purple"
              size="lg"
              height="45px"
              width="145px"
              fontSize="18px"
              onClick={handleSubmit}
              mt={4}
              isDisabled={!isFormValid || isCreating}
            >
              {isCreating ? <Spinner size="sm" /> : "Create"}
            </Button>
          </Box>
          <Divider
            orientation="vertical"
            display={{ base: "none", md: "block" }}
          />

          <Box
            width={{ base: "100%", md: "70%" }}
            padding={2}
            mt={{ base: "4", md: "0" }}
            mx={{ base: "auto", md: "0" }}
            display={{ base: "block", md: "block" }}
            height={{ base: "400px", md: "100%" }}
          >
            <ReactFlow
              colorMode="dark"
              nodeTypes={nodeTypes}
              nodes={store.nodes}
              edges={store.edges}
              onNodesChange={store.onNodesChange}
              onNodesDelete={store.onNodesDelete}
              onEdgesChange={store.onEdgesChange}
              onEdgesDelete={store.onEdgesDelete}
              onConnect={store.addEdge}
              fitView
            >
              <Panel className={"space-x-4"} position="top-right">
                <button
                  className={
                    "px-2 py-1 rounded bg-white shadow text-black font-normal"
                  }
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
                <button
                  className={
                    "px-2 py-1 rounded bg-white shadow text-black font-normal"
                  }
                  onClick={store.addPrompt}
                >
                  Add Prompt
                </button>
              </Panel>
              <Controls />
              <Background />
            </ReactFlow>
          </Box>
        </Flex>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tool Created Successfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your tool has been created successfully{" "}
            <FontAwesomeIcon color="#06D001" icon={faCircleCheck} />
            </Text>
          </ModalBody>
          <ModalFooter>
          <Button mt={4} colorScheme="purple" onClick={handleUseTool}>
              Use Tool
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default isAuth(CreateTool);


