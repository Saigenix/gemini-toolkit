import React from "react";
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
  Input,
  InputGroup,
  InputRightElement,
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
import { SlActionRedo, SlHeart } from "react-icons/sl";
import { BsBookmarkPlus, BsHeartFill, BsHeart } from "react-icons/bs";
import { updateStars, saveTool } from "utils/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/Auth";


function OtherOptions({ toolId, stars }) {
  const [user, loading, error] = useAuthState(auth);
  const [likes, setLikes] = React.useState(stars);
  const [saved, setSaved] = React.useState(false);
  const [shareToolId, setShareToolId] = React.useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [link, setLink] = React.useState<string>("");
  const { hasCopied, onCopy } = useClipboard(link);
  const toast = useToast();
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setLink(window.location.href);
    }
  }, []);

  const handleLike = async (toolId: string) => {
    if (likes > stars) {
      setLikes((prevLikes) => prevLikes - 1);
      await updateStars(toolId, -1);
      return;
    }
    setLikes((prevLikes) => prevLikes + 1);
    await updateStars(toolId, 1);
  };

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

  const handleSave = async (toolId: string) => {
    if (!saved && !loading && user) {
      // console.log("saving");
      try {
        await saveTool(user.uid,toolId);
        toast({
          title: "Tool saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        console.error("Error saving tool:", error);
        toast({
          title: "Failed to save tool.",
          description: "An error occurred while saving the tool.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
    setSaved((prevSaved) => !prevSaved);
  };
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mt={10}>
        <Flex alignItems="center" mr="1.2rem">
          <Icon
            as={likes > stars ? BsHeartFill : BsHeart}
            boxSize="1.2rem"
            cursor="pointer"
            marginRight="0.5rem"
            color={likes ? "red" : ""}
            onClick={() => handleLike(toolId)}
          />
          <Text fontSize="sm">{likes}</Text>
        </Flex>
        <Icon
          as={SlActionRedo}
          boxSize="1.2rem"
          cursor="pointer"
          marginRight="1.2rem"
          onClick={() => handleShare(toolId)}
        />
        <Icon
          as={BsBookmarkPlus}
          boxSize="1.2rem"
          cursor="pointer"
          marginRight="1.2rem"
          color={saved ? "" : ""}
          onClick={() => handleSave(toolId)}
        />
      </Flex>
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
    </>
  );
}

export default OtherOptions;
