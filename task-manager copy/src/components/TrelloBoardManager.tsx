import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import TaskModal from "./TaskModel";
import { format } from "date-fns"; // Import date-fns for formatting

// Trello API credentials
const API_KEY = "568bb98b8f9b5499a7dc46b60f932d2e";
const TOKEN =
  "ATTAeaefe91173843f62313191f4ac7dc8eda5d10c60a30d24483d1c6ae36b527307175673FC";

// Base URL for Trello API
const BASE_URL = "https://api.trello.com/1";

// TypeScript interfaces
interface Column {
  id: string;
  name: string;
  color?: string;
}

interface Task {
  id: string;
  idList: string;
  name: string;
  desc: string;
  date: string; // Added date field
}

const TrelloBoardManager: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boardId, setBoardId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); 
  const [sortOrder, setSortOrder] = useState<string>("desc"); 

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      fetchBoardId();
    }
  }, [navigate]);

 
  const fetchBoardId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/members/me/boards`, {
        params: {
          key: API_KEY,
          token: TOKEN,
        },
      });
      setBoardId(response.data[0].id); 
    } catch (error) {
      console.error("Error getting board ID:", error);
    }
  };

  
  const getColumnsAndTasks = async () => {
    if (!boardId) return; 
    try {
      const columnsResponse = await axios.get(
        `${BASE_URL}/boards/${boardId}/lists`,
        {
          params: {
            key: API_KEY,
            token: TOKEN,
          },
        }
      );

      setColumns(columnsResponse.data);

      const tasksPromises = columnsResponse.data.map((col: Column) =>
        axios.get(`${BASE_URL}/lists/${col.id}/cards`, {
          params: {
            key: API_KEY,
            token: TOKEN,
          },
        })
      );

      const tasksResponses = await Promise.all(tasksPromises);
      const allTasks = tasksResponses.flatMap((response) =>
        response.data.map((task: any) => ({
          ...task,
          date: task.dateLastActivity, 
        }))
      );

      setTasks(allTasks);
    } catch (error) {
      console.error("Error getting columns and tasks:", error);
    }
  };

  // Function to create a new task
  const createTask = async (listId: string, name: string, desc: string) => {
    try {
      await axios.post(`${BASE_URL}/cards`, null, {
        params: {
          idList: listId,
          name: name,
          desc: desc,
          key: API_KEY,
          token: TOKEN,
        },
      });
      getColumnsAndTasks(); // Refresh the tasks list
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Function to update a task
  const updateTask = async (taskId: string, name: string, desc: string) => {
    try {
      await axios.put(`${BASE_URL}/cards/${taskId}`, null, {
        params: {
          name: name,
          desc: desc,
          key: API_KEY,
          token: TOKEN,
        },
      });
      getColumnsAndTasks(); // Refresh the tasks list
      onClose(); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${BASE_URL}/cards/${taskId}`, {
        params: {
          key: API_KEY,
          token: TOKEN,
        },
      });
      getColumnsAndTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Fetch columns and tasks when boardId changes
  // useEffect(() => {
  //   if (boardId) {
  //     getColumnsAndTasks();
  //   }
  // }, [boardId]); 
  useEffect(() => {
    if (boardId) {
      getColumnsAndTasks();
    }
  }, [boardId, getColumnsAndTasks]); 

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort tasks by date
  const sortedTasks = filteredTasks.sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Heading>Trello Board Manager</Heading>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </Flex>
      <Flex justifyContent="center" mb={4}>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </Flex>
      <Flex justifyContent="center" mb={4}>
        <Button
          onClick={() => setSortOrder("asc")}
          mr={2}
          bg={sortOrder === "asc" ? "blue.500" : "gray.300"}
          color={sortOrder === "asc" ? "white" : "black"}
        >
          Sort Ascending
        </Button>
        <Button
          onClick={() => setSortOrder("desc")}
          bg={sortOrder === "desc" ? "blue.500" : "gray.300"}
          color={sortOrder === "desc" ? "white" : "black"}
        >
          Sort Descending
        </Button>
      </Flex>
      <Flex>
        {columns.map((column) => (
          <Box
            key={column.id}
            bg={column.color}
            m={4}
            p={4}
            width="100%"
            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
            borderRadius="10px"
          >
            <Heading as="h2" size="md" mb={4}>
              {column.name}
            </Heading>
            <Input
              type="text"
              placeholder="Task name"
              id={`taskName-${column.id}`}
              mb={2}
              borderRadius="6px"
              border="none"
              boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset"
            />
            <Input
              type="text"
              placeholder="Task description"
              id={`taskDesc-${column.id}`}
              mb={4}
              borderRadius="6px"
              border="none"
              boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset"
            />
            <Flex justifyContent="center" mb={4}>
              <Button
                onClick={() =>
                  createTask(
                    column.id,
                    (
                      document.getElementById(
                        `taskName-${column.id}`
                      ) as HTMLInputElement
                    ).value,
                    (
                      document.getElementById(
                        `taskDesc-${column.id}`
                      ) as HTMLInputElement
                    ).value
                  )
                }
                bg="red.500"
                color="white"
                borderRadius="6px"
              >
                Add Task
              </Button>
            </Flex>
            <List spacing={3}>
              {sortedTasks
                .filter((task) => task.idList === column.id)
                .map((task) => (
                  <ListItem key={task.id}>
                    <Box
                      bg="white"
                      p={4}
                      borderRadius="6px"
                      // boxShadow="md"
                      boxShadow="rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset"
                      mb={2}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedTask(task);
                        onOpen();
                      }}
                    >
                      <Text fontWeight="bold">{task.name}</Text>
                      <Text>{task.desc}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Created on:{" "}
                        {format(new Date(task.date), "MMMM dd, yyyy")}
                      </Text>
                    </Box>
                  </ListItem>
                ))}
            </List>
          </Box>
        ))}
      </Flex>
      {selectedTask && (
        <TaskModal
          isOpen={isOpen}
          onClose={onClose}
          task={selectedTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
    </Box>
  );
};

export default TrelloBoardManager;
