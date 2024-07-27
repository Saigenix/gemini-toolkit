
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
  Spinner,
  Center
} from "@chakra-ui/react";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { ButtonLink } from "components/button-link/button-link";
import {
  Highlights,
  HighlightsItem,
} from "components/highlights";
import { GetAllData } from "utils/firestore";

const Home: NextPage = () => {
  const [tools, setTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const data = GetAllData().then((data) => {
      console.log(data);
      setTools(data);
      setLoading(false);
    });

  },[])
  return (
    <Box>
      <SEO title="Gemini ToolKit" description="Next Generation AI" />
      <Box>
        <ExploreTools />
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
        ) : null}
        <HighlightsSection tools={tools} />
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

const HighlightsSection = ({tools}: any) => {
  return (
    <Highlights>
      {tools.map((highlight, index) => (
        <HighlightsItem key={index} title={highlight.toolName}>
          <Text color="muted" fontSize="lg">
            {highlight.description}
          </Text>
          <Flex justifyContent="space-between" alignItems="center" mt={3}>
            <ButtonGroup spacing={3} alignItems="center">
              <ButtonLink marginTop={2} colorScheme="primary" fontSize="1.2rem" width={110} height={45} href={`/tool?toolID=${highlight.id}`}>
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

