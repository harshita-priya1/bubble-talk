"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const ConversationList = ({
  user,
  setConvName,
  conversations,
  fetchMessages,
  setSelectedConversation,
  setIsLeftPartVisible,
}) => {
  const handleClick = (conversation) => {
    console.log("click");
    console.log("console logging conversation", conversation);
    setConvName(conversation.name);
    setSelectedConversation(conversation._id);
    setIsLeftPartVisible(false);
    console.log(conversation._id);
  };
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 pt-5">Conversations</h2>
      {conversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            gap: "2 rem",
            borderRadius: "1rem",
            padding: "0.5rem",
          }}
        >
          {conversations.map((conversation) => (
            <ListItem
              sx={{
                bgcolor: "#666C5C",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                borderRadius: "1rem",
                ":hover": {
                  bgcolor: "#E4DDD6",
                  color: "#666C5C",
                },
              }}
              key={conversation._id}
              alignItems="flex-start"
              onClick={() => {
                handleClick(conversation);
              }}
              // style={{ margin: "0.5rem" }}
            >
              <ListItemAvatar>
                <Avatar alt={conversation.name} src="" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <p className="md:text-sm">
                      {conversation.participantNames[0] === user.name
                        ? conversation.participantNames[1].toUpperCase()
                        : conversation.participantNames[0].toUpperCase()}
                    </p>
                  </React.Fragment>
                }
                secondary={<React.Fragment></React.Fragment>}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default ConversationList;
