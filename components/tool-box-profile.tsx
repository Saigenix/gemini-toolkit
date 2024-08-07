import React, { useState } from "react";
import { Highlights, HighlightsItem } from "components/highlights";
import { useRouter } from "next/router";
import {
  faArrowUpRightFromSquare,
  faScrewdriverWrench,
  faArrowRightLong,
  faEdit,
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
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { updateToolStatus } from "utils/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OtherOptions from "./other-options";
import { ButtonLink } from "components/button-link/button-link";
import { set } from "date-fns";
function ToolBoxProfile({ highlight, index }) {
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
      <HighlightsItem key={index} title={highlight.toolName}>
        <Icon
          as={FontAwesomeIcon}
          icon={faEdit}
          boxSize="1.2rem"
          position="absolute"
          top={9}
          right={4}
          cursor="pointer"
          onClick={() => router.push(`/edit-tool?toolID=${highlight.id}`)}
        />
        <Flex direction="column" height="100%">
          <Box flex="1">
            <Text color="muted" fontSize="lg">
              {highlight.description}
            </Text>
          </Box>
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
        </Flex>
        <Flex mt={3} alignItems="center">
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
