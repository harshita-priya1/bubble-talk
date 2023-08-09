"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const SearchUsers = ({
  onSearch,
  searchResults,
  setSearchResults,
  startConversation,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(null);
  const [selection, setSelection] = useState(false); // [user, setUser
  const [name, setName] = useState(""); // [user, setUser
  const [selectedUser, setSelectedUser] = useState(null); // [user, setUser
  // Handle user search
  useEffect(() => {
    if (timer) clearTimeout(timer);

    if (inputValue) {
      const newTimer = setTimeout(() => {
        onSearch(inputValue);
      }, 1000);

      setTimer(newTimer);
    }
  }, [inputValue]);

  const handleCancel = () => {
    setInputValue("");
    setSearchResults([]);
    setSelection(false);
    setName("");
    setSelectedUser(null);
  };
  const handleClick = () => {
    startConversation(name, selectedUser._id);
    handleCancel();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search Users</h2>
      {selection ? (
        <div>
          <input
            type="text"
            className="border border-btn px-2 py-1 w-full rounded-full text-black"
            placeholder="Conversation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Stack spacing={2} direction="row" padding={2}>
            <button
              onClick={handleClick}
              className="bg-btn p-2 rounded-md hover:bg-btnh"
            >
              Start
            </button>
            <button
              onClick={handleCancel}
              className="bg-btn p-2 rounded-md hover:bg-btnh"
            >
              Cancel
            </button>
          </Stack>
        </div>
      ) : null}
      {selection != true ? (
        <div className="flex">
          <input
            type="text"
            className="border border-gray-400 px-4 py-1 w-full rounded-full text-black"
            placeholder="Search users..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue != "" ? (
            <button
              className="bg-btn text-white px-4 py-2 ml-2 rounded"
              onClick={handleCancel}
            >
              X
            </button>
          ) : null}
        </div>
      ) : null}
      {/* Render the search results here */}
      {searchResults.length === 0 || selection === true ? (
        <p></p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {searchResults.map((user) => (
            <ListItem
              sx={{
                bgcolor: "#AF7F6F",
                textDecorationColor: "white",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                borderRadius: "1rem",
                ":hover": {
                  bgcolor: "#E4DDD6",
                },
              }}
              key={user._id}
              alignItems="flex-start"
              onClick={() => {
                setSelection(true);
                setSelectedUser(user);
              }}
            >
              <ListItemAvatar>
                <Avatar alt={user.name} src="" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.name}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.email}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            // <li
            //   key={user._id}
            //   className="py-2 bg-black text-white p-2 my-2"
            //   onClick={() => {}}
            // >
            //   <div className="flex gap-4">
            //     <div className="flex-col">
            //       <div>{user.name}</div>
            //       <div>{user.email}</div>
            //     </div>
            //     <button
            //       className="bg-purple-400 rounded-2xl p-2"
            //       onClick={() => {
            //         setSelection(true);
            //         setSelectedUser(user);
            //       }}
            //     >
            //       Select
            //     </button>
            //   </div>
            // </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
