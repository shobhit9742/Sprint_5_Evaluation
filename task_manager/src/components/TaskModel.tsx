// components/TaskModal.tsx

import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  
} from "@chakra-ui/react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: { id: string; name: string; desc: string } | null;
  updateTask: (taskId: string, name: string, desc: string) => void;
  deleteTask: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  updateTask,
  deleteTask,
}) => {
  const [updatedName, setUpdatedName] = React.useState<string>(
    task?.name || ""
  );
  const [updatedDesc, setUpdatedDesc] = React.useState<string>(
    task?.desc || ""
  );

  React.useEffect(() => {
    if (task) {
      setUpdatedName(task.name);
      setUpdatedDesc(task.desc);
    }
  }, [task]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="text"
            placeholder="Task name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            mb={4}
          />
          <Input
            type="text"
            placeholder="Task description"
            value={updatedDesc}
            onChange={(e) => setUpdatedDesc(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              if (task) updateTask(task.id, updatedName, updatedDesc);
            }}
          >
            Update
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              if (task) deleteTask(task.id);
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
