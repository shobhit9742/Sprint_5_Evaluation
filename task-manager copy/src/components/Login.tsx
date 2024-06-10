// components/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  ChakraProvider,
} from "@chakra-ui/react";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = localStorage.getItem(username);

    if (user) {
      const storedUser = JSON.parse(user);
      if (storedUser.password === password) {
        localStorage.setItem("user", JSON.stringify(storedUser));
        navigate("/");
      } else {
        alert("Invalid password");
      }
    } else {
      alert("User not found");
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box p={6} rounded="md" bg="white" boxShadow="md">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Login
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
        <Button colorScheme="blue" onClick={handleLogin} width="full">
          Login
        </Button>
        <Text textAlign="center" mt={4}>
          Don't have an account?{" "}
          <Button variant="link" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
