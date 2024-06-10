// components/SignUp.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  ChakraProvider,
} from "@chakra-ui/react";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    const user = {
      username,
      password,
    };

    localStorage.setItem(username, JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box p={6} rounded="md" bg="white" boxShadow="md">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Sign Up
        </Heading>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={3}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={6}
        />
        <Button colorScheme="blue" onClick={handleSignUp} width="full">
          Sign Up
        </Button>
      </Box>
    </Flex>
  );
};

export default SignUp;
