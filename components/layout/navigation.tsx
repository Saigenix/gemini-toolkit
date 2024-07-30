import * as React from "react";
import {
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import siteConfig from "data/config";
import { NavLink } from "components/nav-link";
import { useScrollSpy } from "hooks/use-scrollspy";
import { MobileNavButton } from "components/mobile-nav";
import { MobileNavContent } from "components/mobile-nav";
import { useDisclosure, useUpdateEffect } from "@chakra-ui/react";
import { SignOut } from "utils/Auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/Auth";
import ThemeToggle from "./theme-toggle";

const Navigation: React.FC = () => {
  const mobileNav = useDisclosure();
  const router = useRouter();
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

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus();
  }, [mobileNav.isOpen]);

  const handleSignOut = () => {
    SignOut();
  };

  return (
    <HStack spacing="2" flexShrink={0}>
      {siteConfig.header.links.map(({ href, id, ...props }, i) => {
        if (href === "/signup" && user) {
          return null;
        } else {
          return (
            <NavLink
              display={["none", null, "block"]}
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

      <ThemeToggle />
      {user && (
        <Menu>
          <MenuButton
            as={Button}
            variant="link"
            rightIcon={
              <Avatar size="sm" name="User Name" src={user.photoURL!} />
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
            <MenuItem onClick={() => router.push("/save")}>Saved Tools</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      )}
      <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
      />

      <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />
    </HStack>
  );
};

export default Navigation;
