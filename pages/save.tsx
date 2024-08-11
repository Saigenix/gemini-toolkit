import * as React from "react";
import {
  Container,
  Box,
  ButtonGroup,
  Button,
  Icon,
  Heading,
  Text,
  IconButton,
  VStack,
  Flex,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { BsBookmarkPlus } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { getSavedTools,getDocumentsByToolIds } from "utils/firestore";
import { SEO } from "components/seo/seo";
import { BackgroundGradient } from "components/gradients/background-gradient";
import { SlActionRedo } from "react-icons/sl";
import { ButtonLink } from "components/button-link/button-link";
import { Highlights, HighlightsItem } from "components/highlights";
import isAuth from "hooks/isAuth";

const SavedTools: React.FC = ({ user }: any) => {
  const [savedTools, setSavedTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSavedTools = async () => {
      try {
        // console.log(user);
        setLoading(true);
        const data = await getSavedTools(user.uid);
        // console.log(data);
        if (data.savedTools) {
          const tools = await getDocumentsByToolIds(data.savedTools);
          // console.log(tools);
          setSavedTools(tools.data || []);
        }else{
          setSavedTools([]);
        }

      } catch (error) {
        console.error("Failed to fetch saved tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTools();
  }, [user]);

  return (
    <Flex direction="column" minHeight="100vh">
      <Box>
        <SEO title="Saved Tools" description="Your saved AI tools" />
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
          ) : (
            <HighlightsSection tools={savedTools} />
          )}
        </Box>
      </Box>
    </Flex>
  );
};

const ExploreTools: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height={400} zIndex="-1" />
      <Container maxW="container.xl" textAlign="center" pb={1}>
        <Heading fontSize={35} as="h1" size="xl" mt={20} paddingBottom={5}>
          Your Saved AI Tools
        </Heading>
      </Container>
    </Box>
  );
};

const HighlightsSection = ({ tools }: { tools: any[] }) => {
  const [shareToolId, setShareToolId] = React.useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [link, setLink] = React.useState<string>("");
  const { hasCopied, onCopy } = useClipboard(link);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setLink(window.location.href);
    }
  }, []);

  const handleShare = (toolId: string) => {
    setShareToolId(toolId);
    if (navigator.share) {
      navigator
        .share({
          title: "Gemini ToolKit",
          url: `${window.location.origin}/tool?toolID=${toolId}`,
        })
        .catch(console.error);
    } else {
      onOpen();
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <Highlights>
        {tools.map((highlight, index) => (
          <HighlightsItem key={index} title={highlight.toolName}>
            <Text color="muted" fontSize="lg">
              {highlight.description}
            </Text>
            <Flex justifyContent="space-between" alignItems="center" mt={3}>
              <ButtonGroup spacing={3} alignItems="center">
                <ButtonLink
                  marginTop={2}
                  colorScheme="primary"
                  fontSize="1.2rem"
                  width={110}
                  height={45}
                  href={`/tool?toolID=${highlight.id}`}
                >
                  Use{" "}
                  <FontAwesomeIcon
                    style={{ marginLeft: "0.5rem" }}
                    icon={faArrowUpRightFromSquare}
                  />
                </ButtonLink>
              </ButtonGroup>
            </Flex>
            {/* <Flex alignItems="center" mt={10}>
              <Icon
                as={SlActionRedo}
                boxSize="1.2rem"
                cursor="pointer"
                marginRight="1.2rem"
                onClick={() => handleShare(highlight.id)}
              />
              <Icon as={BsBookmarkPlus} boxSize="1.2rem" marginRight="1.2rem" />
            </Flex> */}
          </HighlightsItem>
        ))}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Share this Tool</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ButtonGroup spacing={4}>
                <Button
                  colorScheme="whatsapp"
                  onClick={() =>
                    window.open(
                      `https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${window.location.origin}/tool?toolID=${shareToolId}`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  WhatsApp
                </Button>
                <Button
                  colorScheme="linkedin"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        `${window.location.origin}/tool?toolID=${shareToolId}`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  LinkedIn
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() =>
                    window.open(
                      `https://www.instagram.com/?url=${encodeURIComponent(
                        `${window.location.origin}/tool?toolID=${shareToolId}`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  Instagram
                </Button>
                <Button onClick={onCopy}>
                  {hasCopied ? "Link Copied" : "Copy Link"}
                </Button>
              </ButtonGroup>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Highlights>
    </Flex>
  );
};

export default isAuth(SavedTools);
