"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Card, User, Avatar } from "@heroui/react";
import { CloseCircle, Image, Microphone, Send2 } from "iconsax-reactjs";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useFirebaseMessaging } from "@/lib/hooks/useFirebaseMessaging";
import { addToast } from "@heroui/react";
import { useParams, useSearchParams } from "next/navigation";

// Message type
 type Message = {
  id: number;
  message?: string;
  file?: string;
  sender_type: "Client" | "User";
  created_at?: string;
  sender?: {
    id: number;
    name: string;
    image: string | null;
  };
};

// Helper: group messages by minute
const groupMessagesByMinute = (messages: Message[]) => {
  const groups: { time: string; messages: Message[] }[] = [];

  messages.forEach((msg) => {
    const time = msg.created_at
      ? new Date(msg.created_at).toLocaleString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
        })
      : "";

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.time === time) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ time, messages: [msg] });
    }
  });

  return groups;
};

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [input, setInput] = useState("");
  const [offset, setOffset] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const client_id = getCookie("client_id");
  const [isFetching, setIsFetching] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const CHAT_ID = params.id;
  const USER_ID = searchParams.get("user");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on first load
  useEffect(() => {
    if (firstLoad && messages.length > 0) {
      endRef.current?.scrollIntoView({ block: "end" });
      setFirstLoad(false);
    }
  }, [messages, firstLoad]);

  // Handle incoming FCM
  useFirebaseMessaging((payload) => {
    addToast({
      title: "رسالة جديدة",
      description: payload.data?.message || "لديك رسالة جديدة",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
      variant: "solid",
      color: "warning",
    });

    setNewMessageCount((prev) => prev + 1);

    const incomingMessage: Message = {
      id: Date.now(),
      message: payload.data?.message,
      file: payload.data?.file,
      sender_type: "User",
      created_at: new Date().toISOString(),
      sender: {
        id: Number(payload.data?.sender_id) || 0,
        name: payload.data?.sender_name || "المستخدم",
        image: payload.data?.sender_avatar || null,
      },
    };
    setMessages((prev) => [...prev, incomingMessage]);
  });

  // Fetch messages with pagination
  useEffect(() => {
    const fetchMessages = async () => {
      const el = scrollRef.current;
      const oldScrollHeight = el?.scrollHeight || 0;
      setIsFetching(true);
      try {
        const res = await fetchClient(
          `client/chat/get-message?offset=${offset}&chat_id=${CHAT_ID}&sort=desc`,
          axios_config
        );
        if (res?.data?.length) {
          setMessages((prev) => [...res.data, ...prev]);
          requestAnimationFrame(() => {
            if (el) {
              const newScrollHeight = el.scrollHeight;
              el.scrollTop = newScrollHeight - oldScrollHeight;
            }
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMessages();
  }, [offset]);

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetInput = () => {
    setInput("");
    setSelectedFile(null);
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;
    const formData = new FormData();
    formData.append("sender_type", "Client");
    formData.append("sender_id", client_id as string);
    formData.append("receiver_type", "User");
    USER_ID && formData.append("receiver_id", USER_ID.toString());
    CHAT_ID && formData.append("chat_id", CHAT_ID as string);
    formData.append("type", "group");
    if (input.trim()) formData.append("message", input);
    if (selectedFile) formData.append("file", selectedFile);

    const headers = new Headers();
    headers.append("local", "ar");
    headers.append("Accept", "application/json");
    headers.append("Authorization", `Bearer ${getCookie("token")}`);

    try {
      const res = await postData("client/chat/send-message", formData, headers);
      const newMessage: Message = {
        id: res.data.id,
        message: res.data.message,
        file: res.data.file,
        sender_type: res.data.sender_type,
        created_at: res.data.created_at,
        sender: res.data.sender,
      };
      setMessages((prev) => [...prev, newMessage]);
      resetInput();
      setNewMessageCount(0);
    } catch (err) {
      console.error("Error sending message:", err);
      addToast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال الرسالة",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        variant: "solid",
        color: "danger",
      });
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setIsAtBottom(isBottom);

    if (el.scrollTop === 0 && !isFetching) {
      setOffset((prev) => prev + 20);
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [messages]);

  const grouped = groupMessagesByMinute(messages);

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">المحادثة</h2>
          {newMessageCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {newMessageCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setNewMessageCount(0)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          مسح الإشعارات
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-6 scroll"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {isFetching && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {grouped.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {group.messages.map((msg) => (
              <div className="flex flex-col gap-1" key={msg.id}>
                <div
                  className={`flex ${
                    msg.sender_type === "Client"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="flex flex-col max-w-[70%]">
                    {/* Sender Info */}
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        alt={msg.sender?.image ? msg.sender?.name : getInitials(msg.sender?.name)}
                        radius="full"
                        className="w-6 h-6"
                        src={msg.sender?.image || undefined}
                        name={msg.sender?.name ? getInitials(msg.sender?.name) : "?"}
                      />
                      <span className="text-xs text-gray-600">{msg.sender?.name || "مستخدم مجهول"}</span>
                    </div>

                    <Card
                      className={`p-3 rounded-2xl shadow ${
                        msg.sender_type === "Client"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      {msg.message && <p>{msg.message}</p>}
                      {msg.file && (
                        <img
                          src={msg.file}
                          alt="attachment"
                          className="rounded-lg max-w-[200px] mt-2"
                        />
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            ))}
            {/* Shared group timestamp */}
            <div
              className={`flex ${group.messages[0]?.sender_type === "Client"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <span className="text-xs text-gray-400 font-semibold">
                {group.time}
              </span>
            </div>

          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white flex items-center gap-2 border-t">
        <Button onPress={sendMessage} className="rounded-full" isIconOnly>
          <Microphone size={20} />
        </Button>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          <Button
            className="rounded-full"
            isIconOnly
            onPress={() => document.getElementById("fileInput")?.click()}
          >
            <Image size={20} />
          </Button>
        </div>

        {selectedFile && (
          <div className="relative">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="w-14 h-14 rounded-lg object-cover border"
            />
            <button
              className="absolute -top-2 -right-2 bg-white rounded-full shadow"
              onClick={() => setSelectedFile(null)}
            >
              <CloseCircle size={18} color="red" />
            </button>
          </div>
        )}

        <Input
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />

        <Button onPress={sendMessage} className="rounded-full" isIconOnly>
          <Send2 size={20} />
        </Button>
      </div>
    </div>
  );
};
