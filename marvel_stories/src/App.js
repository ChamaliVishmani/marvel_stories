import { useState } from "react";
import CryptoJS from "crypto-js";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  ChakraProvider,
  Container,
  Heading,
  Image,
  Input,
  Stack,
  StackDivider,
  Tag,
  Text,
} from "@chakra-ui/react";

import { MARVEL_PUBLIC_KEY, MARVEL_PRIVATE_KEY } from "./config";

function App() {
  const [character, setCharacter] = useState();
  const [charImage, setCharImage] = useState();
  const [stories, setStories] = useState([]);
  const [searched, setSearched] = useState(false);
  const [attributionText, setAttributionText] = useState();

  const ts = new Date().getTime().toString();
  const dataToHash = ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY;
  const hash = CryptoJS.MD5(dataToHash).toString();

  const getCharacter = async (character) => {
    const url = `https://gateway.marvel.com:443/v1/public/characters?name=${character}&apikey=${MARVEL_PUBLIC_KEY}&ts=${ts}&hash=${hash}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearched(true);
      if (data.data.results[0].thumbnail.path) {
        setCharImage(
          data.data.results[0].thumbnail.path +
            "." +
            data.data.results[0].thumbnail.extension
        );
      }
      if (data.data.results[0].stories.available > 0) {
        const stories = data.data.results[0].stories.items;
        stories.forEach((story) => {
          getStoryData(story.resourceURI);
        });
      }
      if (data.attributionText) {
        setAttributionText(data.attributionText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStoryData = async (resourceURI) => {
    const url = `${resourceURI}?apikey=${MARVEL_PUBLIC_KEY}&ts=${ts}&hash=${hash}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStories((prev) => [
        ...prev,
        {
          title: data.data.results[0].title,
          description: data.data.results[0].description,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearData = () => {
    setCharacter("");
    setCharImage("");
    setStories([]);
    setSearched(false);
  };

  return (
    <ChakraProvider>
      <Container alignContent="center">
        <Heading as="h1" size="2xl" textAlign="center" margin="2rem">
          Marvel Stories
        </Heading>
        <Center>
          <Input
            value={character}
            onChange={(e) => {
              clearData();
              setCharacter(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => getCharacter(character)}
            colorScheme={"yellow"}
          >
            Search
          </Button>
        </Center>

        {searched && (
          <Card>
            <Center>
              <CardHeader>
                {attributionText && (
                  <Tag marginEnd={"auto"}>{attributionText}</Tag>
                )}
                <Center>
                  <Heading
                    textTransform="uppercase"
                    fontSize="medium"
                    marginTop="20px"
                  >
                    {character}
                  </Heading>
                </Center>
              </CardHeader>
            </Center>

            <CardBody>
              {charImage && (
                <Image
                  boxSize="200px"
                  src={charImage}
                  alt="Character"
                  borderRadius="full"
                  margin="auto"
                  marginBlockEnd={4}
                />
              )}

              <Stack divider={<StackDivider />} spacing="4">
                {stories.length > 0 &&
                  stories.map((story, index) => (
                    <Box key={index}>
                      <Heading size="xs">{story.title}</Heading>
                      <Text fontSize="sm">{story.description}</Text>
                    </Box>
                  ))}
              </Stack>
            </CardBody>
          </Card>
        )}
      </Container>
    </ChakraProvider>
  );
}

export default App;
