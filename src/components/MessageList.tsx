// components/MessageList.tsx
import { Box } from "@mui/material";
import { MessageItem, MessageItemProps } from "./MessageItem";

interface MessageListProps {
  messages: MessageItemProps[];
  onView: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, onView }) => {
  return (
    <Box>
      {messages.map((msg) => (
        <MessageItem key={msg.id} {...msg} onView={onView} />
      ))}
    </Box>
  );
};
