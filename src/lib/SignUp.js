import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { nip19 } from "nostr-tools";
import {
  useToast,
  Flex,
  Button,
  Heading,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { generatePrivateKey, getPublicKey } from "nostr-tools";

import useColors from "./useColors";
import { BadgeStatus } from "./BadgeProfile";
import ActionButton from "./ActionButton";
import useLoggedInUser from "./useLoggedInUser";
import { setUser, setPrivateKey } from "../relaysStore";

export default function SignUp() {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nsec, setNsec] = useState("");
  const { highlight, secondary } = useColors();
  const { user, logIn } = useLoggedInUser();

  async function loginWithNsec() {
    try {
      if (nsec.startsWith("nsec")) {
        const decoded = nip19.decode(nsec);
        if (decoded && decoded.type === "nsec") {
          dispatch(setUser(getPublicKey(decoded.data)));
          dispatch(setPrivateKey(decoded.data));
        }
      } else {
        setNsec("");
        toast({
          title: "Invalid nsec",
          status: "error",
        });
      }
    } catch (error) {
      setNsec("");
      toast({
        title: "Invalid nsec",
        status: "error",
      });
      console.error(error);
    }
  }

  function signUp() {
    const priv = generatePrivateKey();
    const pk = getPublicKey(priv);
    dispatch(setPrivateKey(priv));
    dispatch(setUser(pk));
  }

  useEffect(() => {
    if (user) {
      navigate(`/p/${user}`);
    }
  }, [user]);

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      width="340px"
      margin="0 auto"
    >
      <Image src="/badges.png" alt="Badges" width="270px" height="280px" />
      <Heading fontSize="2xl" mt={6} mb={4}>
        Join Blue Checkmark Club!
      </Heading>
      <Text color={secondary}>
        It used to be that a blue checkmark meant something. You were verified, you mattered! 
        <br></br>
        It was a
        a badge of honor and indication that you meant something. Now twitter has taken that all away
        and a blue checkmark just means that you're an active supporter of Elon Musk and what he's
        done to twitter!
      </Text>
      <br></br>
      <Text color={secondary}>
       With Blue Checkmark Club you can get your own checkmark badge! Instead of waiting for a benovlant
       dictator to decide who's worthy, we can do it ourselves. So join the blue checkmark club and start
       bestowing badges on all your friends. 
      </Text>
      <br></br>
      <Text color={secondary}>
       The blue checkmark club works with the open social nostr protocol. You can start creating badges
       right away, but it works better if you use it with 
       <a href="https://nostr.how/">other nostr applications</a>. 
      </Text>
      <ActionButton mt={4} width="100%" onClick={signUp}>
        Sign up
      </ActionButton>
      {window.nostr && (
        <ActionButton mt={4} width="100%" onClick={logIn}>
          Login with extension
        </ActionButton>
      )}
      <BadgeStatus my={6} state="not-collected">
        or
      </BadgeStatus>
      <FormControl>
        <FormLabel>Sign in with your nsec</FormLabel>
        <Input
          type="text"
          placeholder="nsec..."
          value={nsec}
          onChange={(e) => setNsec(e.target.value)}
        />
        <FormHelperText>
          We recommend using an extension such as{" "}
          <Link to="https://getalby.com/">
            <Text as="span" color={highlight}>
              Alby
            </Text>
          </Link>{" "}
          to log in.
        </FormHelperText>
      </FormControl>
      <Button mt={4} width="100%" onClick={loginWithNsec}>
        Sign In
      </Button>
    </Flex>
  );
}
