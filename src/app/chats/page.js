"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import ConversationList from "./components/ConversationList";
import MessageList from "./components/MessageList";
import SearchUsers from "./components/SearchUsers";
import Send from "./components/Send";
import { useRouter } from "next/navigation";

var socket;

export default function ChatPage() {
  const router = useRouter();
  const handleLogout = () => {
    // Clear out the cookies
    localStorage.clear();
    router.push("/login");
    // Route to the /login page
  };
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationName, setConversationName] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLeftPartVisible, setIsLeftPartVisible] = useState(true); // State to manage visibility of the left part

  const scrollContainerRef = useRef(null);

  // Fetch the user data from cookies

  let user = useRef(null);
  let token = useRef(null);

  const toggleLeftPartVisibility = () => {
    setIsLeftPartVisible((prevState) => !prevState);
  };
  useEffect(() => {
    user.current = localStorage.getItem("user");
    token.current = localStorage.getItem("token");
    if (user) {
      user.current = JSON.parse(user.current);
    }
  }, []);
  useEffect(() => {
    fetchData();

    // Establish a Socket.IO connection
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URI);

    // Emit a "setup" event to the server to identify the current user
    socket.emit("setup", user.current);

    // Listen for a "connected" event to confirm the connection is successful
    socket.on("connected", () => {
      console.log("Socket.IO connected to the server.");
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
      console.log("another user typing in room: ", selectedConversation);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
      console.log(
        "another user stopped typing in room: ",
        selectedConversation
      );
    });

    socket.on("messageRecieved", (newMessage) => {
      fetchMessages(newMessage.conversation);
      console.log("recieved message in room: ", newMessage.conversation);
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off();
    };
  }, []);

  //ISSUE: fix issue with conversations not updating
  //NOTE: this works now , thanks to the useEffect below, source:https://bosctechlabs.com/solve-changes-not-reflecting-when-usestate-set-method/#:~:text=It%20is%20the%20failure%20of,updates%20are%20not%20reflected%20immediately.
  //NOTE: another solution is to pass callback to setState().
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchData = async () => {
    try {
      // Fetch conversations
      const conversationsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/messages/getConv`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );

      const conversationsData = await conversationsResponse.json();
      setConversations(conversationsData.conversations);
    } catch (error) {
      console.error("Error fetching conversations and messages:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const messagesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/messages/${conversationId}/getMessages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );

      const messagesData = await messagesResponse.json();
      // console.log(messagesData);
      setMessages(messagesData.messages);
      console.log("joining conversationID: ", selectedConversation);
      socket.emit("join chat", selectedConversation);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to search users and fetch search results
  const handleSearch = async (query) => {
    try {
      const searchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/search?query=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );

      const searchData = await searchResponse.json();
      setSearchResults(searchData.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };
  const onSend = async (message) => {
    console.log("sending to: ", selectedConversation);
    try {
      const sendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/messages/${selectedConversation}/sendMessage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.current}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message,
            senderName: user.current.name,
          }),
        }
      );

      const sendData = await sendResponse.json();
      const data = sendData.data;
      socket.emit("new message", data);
      console.log("sending message to room: ", selectedConversation);
      fetchMessages(selectedConversation);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startConversation = async (name, receiverId) => {
    try {
      console.log(receiverId, name);
      console.log("creating conversation with: ", receiverId);
      console.log("creating conversation from: ", user.current._id);
      const sendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/messages/createConv`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.current}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            participants: [user.current._id, receiverId],
          }),
        }
      );
      const sendData = await sendResponse.json();

      if (sendResponse.status === 201) {
        console.log(sendData);
        fetchData();
      } else {
        console.log(sendData);
      }
    } catch (error) {}
  };
  let typingTimeout;

  const typingHandler = (e) => {
    if (!socketConnected) return;

    // Clear any existing timer
    clearTimeout(typingTimeout);

    if (!typing) {
      setTyping(true);
      console.log("typing:", typing);
      socket.emit("typing", selectedConversation);
    }

    // Set a new timer
    typingTimeout = setTimeout(() => {
      if (typing) {
        console.log("typing: ", typing);
        socket.emit("stop typing", selectedConversation);
        setTyping(false);
      }
    }, 1000);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom when the component mounts and whenever new content is added
    scrollToBottom();
  }, [messages, istyping]);

  return (
    <div>
      <nav className="bg-purple-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="block mr-4 text-white"
            onClick={toggleLeftPartVisibility}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Sharito</h1>
        </div>
        <div className="space-x-2">
          <button
            className="text-white bg-purple-700 hover:bg-purple-600 px-3 py-2 rounded"
            onClick={() => {
              router.push("/sharito");
            }}
          >
            Home
          </button>
          {/* <button className="text-white bg-purple-700 hover:bg-purple-600 px-3 py-2 rounded">
            About
          </button>
          <button className="text-white bg-purple-700 hover:bg-purple-600 px-3 py-2 rounded">
            Help
          </button> */}
          <button
            className="text-white bg-red-600 hover:bg-red-500 px-3 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="flex bg-violet-400 h-screen text-white">
        {/* Left Sidebar */}
        <div
          className={`left-0 w-1/4 border-r border-gray-300 p-5 ${
            isLeftPartVisible ? "block max-md:w-full" : "hidden md:block"
          }`}
        >
          <SearchUsers
            onSearch={handleSearch}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            startConversation={startConversation}
          />
          <ConversationList
            user={user.current}
            setConvName={setConversationName}
            conversations={conversations}
            fetchMessages={fetchMessages}
            setSelectedConversation={setSelectedConversation}
            setIsLeftPartVisible={setIsLeftPartVisible}
          />
        </div>
        {/* Right Sidebar */}
        <div
          className={`w-3/4 p-4 overflow-y-scroll ${
            isLeftPartVisible ? "max-md:hidden" : "w-full"
          }`}
          ref={scrollContainerRef}
        >
          {selectedConversation && (
            <MessageList
              conversation={conversationName}
              user={user.current}
              messages={messages}
              typing={typing}
              istyping={istyping}
            />
          )}
          {selectedConversation && (
            <div className="fixed w-full bottom-2 max-md:w-auto ">
              <Send
                onSend={onSend}
                typing={typing}
                istyping={istyping}
                handler={typingHandler}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
