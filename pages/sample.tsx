"use client";
import * as React from "react";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faScrewdriverWrench,
  faArrowRightLong,
  faEdit, // Import edit icon
} from "@fortawesome/free-solid-svg-icons";
import { SlActionRedo, SlHeart } from "react-icons/sl";
import { BsBookmarkPlus } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";
import {
  Container,
  Box,
  ButtonGroup,
  Button,
  Icon,
  Heading,
  Text,
  Flex,
  Switch,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import { Highlights, HighlightsItem } from "components/highlights";
import { useState, useEffect } from "react";
import { getDocumentsByUserId, updateDocumentStatus } from "utils/firestore";
import { useRouter } from "next/router";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls } from "@xyflow/react";

const Sample: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [documents, setDocuments] = useState<any>([]);
  const [loading1, setLoading] = useState(false);
  const router = useRouter();
 const nodes = [
   {
     id: "1",
     position: { x: 0, y: 0 },
     data: { label: "Hello" },
     type: "input",
    draggable: true
   },
   {
     id: "2",
     position: { x: 100, y: 100 },
     data: { label: "World" },
   },
 ];
const edges = [{ id: "1-2", source: "1", target: "2" }];

  return (
    <Box height={500} mt={20}>
      <ReactFlow colorMode="dark" nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
};


export default Sample;


