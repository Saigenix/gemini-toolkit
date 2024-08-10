import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  useUpdateEffect,
  useColorMode,
  keyframes,
  Text,
} from "@chakra-ui/react";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import siteConfig from "data/config";
import { BellIcon } from "@chakra-ui/icons";
import { NavLink } from "components/nav-link";
import { useScrollSpy } from "hooks/use-scrollspy";
import { MobileNavButton } from "components/mobile-nav";
import { MobileNavContent } from "components/mobile-nav";
import { SignOut } from "utils/Auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/Auth";
import ThemeToggle from "./theme-toggle";
import { FiMoreVertical } from "react-icons/fi";
import ChatbotModal from "components/chatbox";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Navigation: React.FC = () => {
  const mobileNav = useDisclosure();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const activeId = useScrollSpy(
    siteConfig.header.links
      .filter(({ id }) => id)
      .map(({ id }) => `[id="${id}"]`),
    {
      threshold: 0.75,
    }
  );
  const [user, loading, error] = useAuthState(auth);
  const mobileNavBtnRef = React.useRef<HTMLButtonElement>();
  const [showNotification, setShowNotification] = React.useState(false);
  const { colorMode } = useColorMode();

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus();
  }, [mobileNav.isOpen]);

  const handleSignOut = () => {
    SignOut();
  };

  const handleBellClick = () => {
    setShowNotification(!showNotification);
  };

  const showNotificationBell = useBreakpointValue({ base: false, md: true });

  return (
    <HStack spacing="2" flexShrink={0} position="relative">
      {siteConfig.header.links.map(({ href, id, ...props }, i) => {
        if (href === "/signup" && user) {
          return null;
        } else {
          return (
            <NavLink
              display={["block", null, "block"]}
              href={href || `/#${id}`}
              key={i}
              isActive={
                !!(
                  (id && activeId === id) ||
                  (href && !!router.asPath.match(new RegExp(href)))
                )
              }
              {...props}
            >
              {props.label}
            </NavLink>
          );
        }
      })}

      {showNotificationBell && (
        <>
          <IconButton
            aria-label="Chatbot"
            icon={<FontAwesomeIcon icon={faCommentDots} />}
            colorScheme="purple"
            borderRadius="full"
            size="sm"
            onClick={onOpen}
          />
          {user && <ChatbotModal isOpen={isOpen} onClose={onClose} />}
          <IconButton
            aria-label="Notifications"
            icon={<BellIcon />}
            variant="ghost"
            marginRight={-2}
            fontSize="1.2rem"
            onClick={handleBellClick}
          />
          {showNotification && (
            <Box
              position="absolute"
              top="50px"
              right="0"
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "black" : "white"}
              p="4"
              borderRadius="md"
              boxShadow="md"
              zIndex="1"
              width="300px"
              display="flex"
              alignItems="center"
              fontWeight="bold"
            >
              <Box
                as="img"
                src="/static/images/gemini.png"
                alt="Website Logo"
                borderRadius="full"
                width="40px"
                height="40px"
                mr="3"
                animation={`${spin} infinite 2s linear`}
              />
              <Box>
                <Text>Hello 👋 {user?.displayName}</Text>
                <Text fontSize="sm" opacity="0.8">
                  Welcome to Gemini Toolkit, Let's Create Your Own AI Tools 🤩
                </Text>
              </Box>
            </Box>
          )}
        </>
      )}

      <ThemeToggle />

      {user && (
        <Menu>
          <MenuButton
            as={Button}
            variant="link"
            rightIcon={
              <>
                <Avatar size="sm" name="User Name" src={user.photoURL!} />
                <IconButton
                  aria-label="Options"
                  icon={<FiMoreVertical />}
                  variant="link"
                  fontSize="1.2rem"
                />
              </>
            }
            sx={{
              textDecoration: "none",
              _hover: { textDecoration: "none" },
              _focus: { textDecoration: "none" },
              _active: { textDecoration: "none" },
            }}
          >
            {user.displayName}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => router.push("/save")}>
              Saved Tools
            </MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      )}

      {/* <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
      /> */}

      {/* <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} /> */}
    </HStack>
  );
};

export default Navigation;
