import React, { useState } from "react";
import { Highlights, HighlightsItem } from "components/highlights";
import { useRouter } from "next/router";
import {
  faArrowUpRightFromSquare,
  faScrewdriverWrench,
  faArrowRightLong,
  faEdit,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
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
  Switch,
  Flex,
  Spinner,
  Center,
  Divider,
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { updateToolStatus, deleteTool } from "utils/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OtherOptions from "./other-options";
import { ButtonLink } from "components/button-link/button-link";

function ToolBoxProfile({ highlight, index, HandleDelete }) {
  const toast = useToast();
  const router = useRouter();
  const [status, setStatus] = useState(highlight.status);

  const togglePublicPrivate = async (id: string, status: boolean) => {
    // To set status to true
    const resultTrue = await updateToolStatus(id, !status);

    if (resultTrue.success) {
      console.log(resultTrue.message);
      toast({
        title: "Success",
        description: `Tool status updated successfully to ${
          status ? "private" : "public"
        }`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.error(resultTrue.message, resultTrue.error);
      toast({
        title: "Error",
        description: `Tool status updated successfully to public`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <HighlightsItem key={index}>
        <Flex direction="column" height="100%">
          <Heading
            fontSize={25}
            mb={5}
            paddingRight="4rem"
            maxWidth="calc(100% - 8rem)"
            minWidth="270px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="normal"
          >
            {highlight.toolName}
          </Heading>
          <Icon
            as={FontAwesomeIcon}
            icon={faEdit}
            boxSize="1.1rem"
            position="absolute"
            top={9}
            right={10}
            cursor="pointer"
            onClick={() => {
              if (highlight.prompts.length > 1) {
                toast({
                  title: "Error",
                  description: `editing complex tools is coming soon...`,
                  status: "info",
                  duration: 5000,
                  isClosable: true,
                });
              } else {
                router.push(`/edit-tool?toolID=${highlight.id}`);
              }
            }}
          />
          <Icon
            as={FontAwesomeIcon}
            icon={faTrashCan}
            boxSize="1.1rem"
            position="absolute"
            top={9}
            right={3}
            cursor="pointer"
            color={"#F32424"}
            onClick={() => {
              HandleDelete(highlight.id);
            }}
          />
        </Flex>
        <Flex direction="column" height="140%">
          <Box flex="1" minHeight="100px">
            <Text color="muted" fontSize="lg" noOfLines={3}>
              {highlight.description}
            </Text>
          </Box>
          <Flex justifyContent="space-between" alignItems="center" mt={3}>
            <ButtonGroup spacing={3} alignItems="center">
              <ButtonLink
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
        </Flex>
        <Divider my={8} mb={1} borderColor="green.500" borderWidth="1px" />
        <Flex alignItems="center">
          <OtherOptions toolId={highlight.id} stars={highlight.stars} />
          <Text marginTop={10} paddingLeft={5}>
            {highlight.status ? "Public" : "Private"}
          </Text>
          <Switch
            marginTop={10}
            paddingLeft={2}
            isChecked={status}
            onChange={() => {
              togglePublicPrivate(highlight.id, status);
              setStatus((prev) => !prev);
            }}
            colorScheme="green"
          />
          <Flex />
        </Flex>
      </HighlightsItem>
    </>
  );
}

export default ToolBoxProfile;
