import { Box, Image, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import geminiLogo from "../public/static/images/gemini.png";
import React from "react";

export const Logo: React.FC = (props) => {
  const color = useColorModeValue("#231f20", "#fff");

  return (
    <Flex alignItems="center" {...props}>
      <Box
        as="img"
        src={geminiLogo.src}
        alt="Gemini Logo"
        boxSize="1.6rem"
        position="absolute"
        left={2}
      />
      <Text fontSize="xl" fontWeight="bold" ml={1} color={color}>
        Gemini Toolkit
      </Text>
    </Flex>
  );
};




