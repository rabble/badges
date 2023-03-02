import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";

import { encodeNaddr, findTag } from "../nostr";

import Username from "./Username";
import useColors from "./useColors";

export default function Badge({ ev, ...rest }) {
  const d = findTag(ev.tags, "d");
  const { surface, border, secondary, highlight } = useColors();
  const name = findTag(ev.tags, "name");
  const description = findTag(ev.tags, "description");
  const image = findTag(ev.tags, "image");
  const thumb = findTag(ev.tags, "thumb");
  return (
    <Card
      background={surface}
      borderRadius="23px"
      border="2px solid"
      maxWidth="420px"
      borderColor={border}
      {...rest}
    >
      <CardHeader>
        <Link to={`/b/${encodeNaddr(ev)}`}>
          <Flex alignItems="flex-start">
            <Box width="60px" height="60px" mr={2}>
              <Image
                src={image || thumb}
                alt={name}
                fallbackSrc="https://via.placeholder.com/60"
              />
            </Box>
            <Flex flexDirection="column">
              <Heading fontSize="19px" fontWeight={700} lineHeight="23.43px">
                {name || d}
              </Heading>
            </Flex>
          </Flex>
        </Link>
      </CardHeader>
      <CardBody color={secondary} mt="-60px" ml="70px">
        <Text fontSize="13px" fontWeight={500} lineHeight="19px">
          {description}
        </Text>
        <Text mt={1} fontSize="xs">
          By: <Username color={highlight} pubkey={ev.pubkey} />
        </Text>
      </CardBody>
    </Card>
  );
}
