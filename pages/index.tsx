import * as React from "react";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { SlActionRedo, SlHeart } from "react-icons/sl";
import { BsBookmarkPlus } from "react-icons/bs";
import {
  Container,
  Box,
  ButtonGroup,
  Button,
  Icon,
  Heading,
  Text,
  useClipboard,
  IconButton,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import {
  Highlights,
  HighlightsItem,
} from "components/highlights";

const Home: NextPage = () => {
  return (
    <Box>
      <SEO title="NexAI" description="Next Generation AI" />
      <Box>
        <ExploreTools />
        <HighlightsSection />
      </Box>
    </Box>
  );
};

const ExploreTools: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height={400} zIndex="-1" />
      <Container maxW="container.xl" textAlign="center" pb={1}> 
        <Heading fontSize={35} as="h1" size="xl" mt={20} paddingBottom={5}>
          Explore AI Tools
        </Heading>
      </Container>
    </Box>

  );
};

const HighlightsSection = () => {
  const highlightsData = [
    {
      title: "Tool 1",
      description: "Description for tool 1. Selected the most productive and established tools in the scene and build Saas UI on top of it.",
      href: "#",
    },
    {
      title: "Tool 2",
      description: "Description for tool 2. Selected the most productive and established tools in the scene and build Saas UI on top of it.",
      href: "#",
    },
    {
      title: "Tool 3",
      description: "Description for tool 3. Selected the most productive and established tools in the scene and build Saas UI on top of it.",
      href: "#",
    },
  ];

  return (
    <Highlights>
      {highlightsData.map((highlight, index) => (
        <HighlightsItem key={index} title={highlight.title}>
          <Text color="muted" fontSize="lg">
            {highlight.description}
          </Text>
          <Flex justifyContent="space-between" alignItems="center" mt={3}>
            <ButtonGroup spacing={3} alignItems="center">
              <ButtonLink marginTop={2} colorScheme="primary" fontSize="1.2rem" width={110} height={45} href={highlight.href}>
                Use <FontAwesomeIcon style={{ marginLeft: '0.5rem' }} icon={faArrowUpRightFromSquare} />
              </ButtonLink>
            </ButtonGroup>
          </Flex>
          <Flex alignItems="center" mt={10}>
            <Icon as={SlHeart} boxSize="1.2rem" cursor="pointer" marginRight="1.2rem" />
            <Icon as={SlActionRedo} boxSize="1.2rem" cursor="pointer" marginRight="1.2rem" />
            <Icon as={BsBookmarkPlus} boxSize="1.2rem" cursor="pointer" marginRight="1.2rem" />
          </Flex>
        </HighlightsItem>
      ))}
    </Highlights>
  );
};

export default Home;

