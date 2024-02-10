import "./App.css";
import CryptoJS from "crypto-js";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  ChakraProvider,
  Container,
  Heading,
  Image,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { MARVEL_PUBLIC_KEY, MARVEL_PRIVATE_KEY } from "./config";
import { useState } from "react";

function App() {
  const [character, setCharacter] = useState();
  const [charImage, setCharImage] = useState();
  const [stories, setStories] = useState([]);
  const ts = new Date().getTime().toString();
  const dataToHash = ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY;
  const hash = CryptoJS.MD5(dataToHash).toString();

  const getCharacter = async (character) => {
    const url = `https://gateway.marvel.com:443/v1/public/characters?name=${character}&apikey=${MARVEL_PUBLIC_KEY}&ts=${ts}&hash=${hash}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.data.results[0].thumbnail.path) {
        setCharImage(
          data.data.results[0].thumbnail.path +
            "." +
            data.data.results[0].thumbnail.extension
        );
      }
      if (data.data.results[0].stories.available > 0) {
        console.log(data.data.results[0].stories.items);
        const stories = data.data.results[0].stories.items;
        stories.forEach((story) => {
          console.log(story.name);
          console.log(story.resourceURI);
          getStoryData(story.resourceURI);
        });
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
      console.log(data.data.results[0].title);
      console.log(data.data.results[0].description);
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

  return (
    <ChakraProvider>
      <Container>
        <Heading as="h1" size="2xl" textAlign="center" margin="2rem">
          Marvel Stories
        </Heading>
        <Input
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
        ></Input>
        <Button onClick={() => getCharacter(character)}>Search</Button>
        <Card>
          <CardHeader>
            <Heading textTransform="uppercase">{character}</Heading>
          </CardHeader>
          <CardBody>
            <Image boxSize="200px" src={charImage} alt="Character" />
            <Stack divider={<StackDivider />}>
              {stories.length > 0 &&
                stories.map((story, index) => (
                  <Box key={index}>
                    <Heading>{story.title}</Heading>
                    <Text>{story.description}</Text>
                  </Box>
                ))}
            </Stack>
          </CardBody>
          {/* {stories.map((story, index) => (
            <CardBody key={index}>
              <Heading>{story.title}</Heading>
              <p>{story.description}</p>
            </CardBody>
          ))} */}
        </Card>
      </Container>
    </ChakraProvider>
  );
}

export default App;
