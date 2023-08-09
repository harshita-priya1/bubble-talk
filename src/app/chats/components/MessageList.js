import React from "react";
import TypingAni from "./TypingAnimation";
const MessageList = ({ conversation, user, messages, typing, istyping }) => {
  return (
    <div>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="divide-y divide-gray-300 pb-8">
          {messages.map((message) => (
            <li
              key={message._id}
              className={`py-2 px-2 my-2 rounded-2xl ${
                message.sender._id === user._id
                  ? "bg-eled text-right pr-5 rounded-tr-sm"
                  : "bg-btn pl-5 rounded-tl-sm"
              }`}
            >
              <div className="text-sm text-white mb-2">{message.content}</div>
              <div className="text-xs text-slate-200">
                {message.senderName} •{" "}
                {new Date(message.createdAt).toLocaleTimeString([], {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </li>
          ))}
          {istyping == true ? (
            <TypingAni width={"4rem"} height={"4rem"} />
          ) : null}
        </ul>
      )}
    </div>
  );
};

export default MessageList;
