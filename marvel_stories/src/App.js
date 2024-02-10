// import logo from "./logo.svg";
import "./App.css";
import CryptoJS from "crypto-js";
import {
  Button,
  ChakraProvider,
  Container,
  Heading,
  Image,
  Input,
} from "@chakra-ui/react";
import { MARVEL_PUBLIC_KEY, MARVEL_PRIVATE_KEY } from "./config";
import { useState } from "react";

function App() {
  const [character, setCharacter] = useState();
  const [charImage, setCharImage] = useState();
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
        <Image src={charImage} alt="Character" />
      </Container>
    </ChakraProvider>
  );
}

export default App;
