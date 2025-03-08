import React, { useState, useEffect, useRef } from "react";
import {
  MdOutlineCancel,
  MdClose,
  MdSend,
  MdEdit,
  MdDelete,
  MdCheck,
  MdMinimize,
  MdReply,
  MdContentCopy,
  MdShare,
  MdStar,
  MdPushPin,
  MdInfo,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { Button } from ".";
import { chatData, automatedResponses } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";

const Chat = () => {
  const { currentColor } = useStateContext();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatContainerRef = useRef(null);
  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
    chatId: null,
    text: "",
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages[selectedMessage?.id]]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.visible && !e.target.closest(".context-menu-container")) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * automatedResponses.length);
    return automatedResponses[randomIndex];
  };

  const simulateTyping = (messageId, callback) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 2000);
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (!messages[message.id]) {
      setMessages((prev) => ({
        ...prev,
        [message.id]: [
          {
            id: 1,
            text: message.desc,
            sender: "them",
            time: message.time,
          },
        ],
      }));
    }
  };

  const handleEdit = (messageId, text) => {
    setEditingMessage(messageId);
    setEditText(text);
  };

  const handleSaveEdit = (chatId, messageId) => {
    if (!editText.trim()) return;

    setMessages((prev) => ({
      ...prev,
      [chatId]: prev[chatId].map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              text: editText,
              edited: true,
              editedTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : msg
      ),
    }));
    setEditingMessage(null);
    setEditText("");
  };

  const handleDelete = (chatId, messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setMessages((prev) => ({
        ...prev,
        [chatId]: prev[chatId].filter((msg) => msg.id !== messageId),
      }));
    }
  };

  // Toggle the context menu when the down arrow is clicked
  const toggleContextMenu = (e, msg, chatId) => {
    e.stopPropagation();

    if (contextMenu.visible && contextMenu.messageId === msg.id) {
      // Close if already open for this message
      setContextMenu({ ...contextMenu, visible: false });
    } else {
      // Position menu relative to the clicked element
      const rect = e.currentTarget.getBoundingClientRect();
      setContextMenu({
        visible: true,
        x: rect.right,
        y: rect.top,
        messageId: msg.id,
        chatId: chatId,
        text: msg.text,
      });
    }
  };

  const handleContextMenuAction = (action) => {
    const { chatId, messageId, text } = contextMenu;

    switch (action) {
      case "edit":
        handleEdit(messageId, text);
        break;
      case "delete":
        handleDelete(chatId, messageId);
        break;
      case "reply":
        // Add reply functionality here
        setNewMessage(`Replying to: "${text.substring(0, 20)}..."`);
        break;
      case "copy":
        navigator.clipboard.writeText(text);
        break;
      default:
        break;
    }

    // Close context menu
    setContextMenu({ ...contextMenu, visible: false });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
    setNewMessage("");
    setEditingMessage(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMessage) return;

    const newMsg = {
      id: messages[selectedMessage.id]?.length + 1 || 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedMessage.id]: [...(prev[selectedMessage.id] || []), newMsg],
    }));

    setNewMessage("");

    simulateTyping(selectedMessage.id, () => {
      const responseMsg = {
        id: messages[selectedMessage.id]?.length + 2 || 2,
        text: getRandomResponse(),
        sender: "them",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedMessage.id]: [
          ...(prev[selectedMessage.id] || []),
          responseMsg,
        ],
      }));
    });
  };

  // WhatsApp-style context menu component
  const ContextMenu = () => {
    if (!contextMenu.visible) return null;

    return (
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden context-menu-container"
        style={{
          top: contextMenu.y,
          left: Math.min(contextMenu.x, window.innerWidth - 320),
          width: "200px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("reply")}
          >
            <MdReply className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">Reply</span>
          </div>

          <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("copy")}
          >
            <MdContentCopy className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">Copy</span>
          </div>

          {/* <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("forward")}
          >
            <MdShare className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">Forward</span>
          </div> */}

          {/* <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("star")}
          >
            <MdStar className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">Star</span>
          </div> */}

          {/* <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("pin")}
          >
            <MdPushPin className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">Pin</span>
          </div> */}

          <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("delete")}
          >
            <MdDelete className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-red-500">Delete</span>
          </div>

          <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("edit")}
          >
            <MdEdit className="w-5 h-5 mr-3 text-blue-500" />
            <span className="text-blue-500">Edit</span>
          </div>

          {/* <div
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleContextMenuAction("info")}
          >
            <MdInfo className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">Info</span>
          </div> */}
        </div>
      </div>
    );
  };

  const MessageItem = ({ msg, chatId }) => (
    <div
      key={msg.id}
      className={`flex ${
        msg.sender === "me" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        style={msg.sender === "me" ? { backgroundColor: currentColor } : {}}
        className={`max-w-[70%] rounded-lg p-3 relative group ${
          msg.sender === "me"
            ? "text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        {editingMessage === msg.id ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-1 rounded border text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-600"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleSaveEdit(chatId, msg.id)}
                className="p-1 rounded bg-green-500 hover:bg-green-600"
              >
                <MdCheck size={16} />
              </button>
              <button
                onClick={() => setEditingMessage(null)}
                className="p-1 rounded bg-red-500 hover:bg-red-600"
              >
                <MdClose size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p>{msg.text}</p>
            <span
              className={`text-xs block mt-1 ${
                msg.sender === "me"
                  ? "text-gray-200"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {msg.time}
              {msg.edited && " (edited)"}
            </span>

            {/* Down arrow menu trigger - only visible on hover for user's messages */}
            {msg.sender === "me" && (
              <button
                className="absolute right-20 top-5 bg-slate-700 opacity-0 group-hover:opacity-100 py-1 px-2 rounded-full transition-opacity"
                onClick={(e) => toggleContextMenu(e, msg, chatId)}
              >
                <MdKeyboardArrowDown size={16} className="text-white" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  const ChatList = ({ isFullScreen = false }) => (
    <div
      className={`${
        isFullScreen ? "h-[calc(115vh-200px)] mx-5" : "max-h-80"
      } overflow-y-auto`}
    >
      {chatData?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-5 border-b-1 border-color p-3 leading-8 cursor-pointer hover:bg-light-gray"
          onClick={() => handleMessageClick(item)}
        >
          <div className="relative">
            <img
              className="rounded-full h-10 w-10"
              src={item.image}
              alt={item.message}
            />
            <span
              style={{ background: item.dotColor }}
              className="absolute inline-flex rounded-full h-2 w-2 right-0 -top-1"
            />
          </div>
          <div>
            <p className="font-semibold dark:text-gray-200">{item.message}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {item.desc}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {item.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`${
        isFullScreen
          ? "fixed inset-0 z-[1100] bg-white dark:bg-[#42464D]"
          : "nav-item absolute right-5 md:right-52 top-12 bg-white dark:bg-[#42464D] p-5 rounded-lg w-96"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Messages</p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange"
          >
            5 New
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            icon={isFullScreen ? <MdMinimize /> : <MdClose />}
            color="rgb(153, 171, 180)"
            bgHoverColor="light-gray"
            size="2xl"
            borderRadius="50%"
            onClick={() => setIsFullScreen(!isFullScreen)}
          />
          {isFullScreen && (
            <Button
              icon={<MdOutlineCancel />}
              color="rgb(153, 171, 180)"
              bgHoverColor="light-gray"
              size="2xl"
              borderRadius="50%"
              onClick={() => setIsFullScreen(false)}
            />
          )}
        </div>
      </div>

      <ChatList isFullScreen={isFullScreen} />

      {!isFullScreen && (
        <div className="mt-5">
          <button
            onClick={() => {
              setIsFullScreen(true);
            }}
            style={{
              backgroundColor: currentColor,
              borderRadius: "10px",
              width: "100%",
              color: "white",
              padding: "0.7rem",
            }}
          >
            See all messages
          </button>
        </div>
      )}

      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#42464D] rounded-lg w-full max-w-full mx-4 h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
              <div className="flex items-center gap-3">
                <img
                  className="rounded-full h-10 w-10"
                  src={selectedMessage.image}
                  alt={selectedMessage.message}
                />
                <div>
                  <h3 className="font-semibold dark:text-gray-200">
                    {selectedMessage.message}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isTyping ? "Typing..." : "Online"}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages[selectedMessage.id]?.map((msg) => (
                <MessageItem
                  key={msg.id}
                  msg={msg}
                  chatId={selectedMessage.id}
                />
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t dark:border-gray-600"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full"
                  style={{ backgroundColor: currentColor }}
                >
                  <MdSend className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ContextMenu />
    </div>
  );
};

export default Chat;
