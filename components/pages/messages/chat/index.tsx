"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Card } from "@heroui/react";
import { CloseCircle, Image, Microphone, Send2 } from "iconsax-reactjs";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useFirebaseMessaging } from "@/lib/hooks/useFirebaseMessaging";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { useParams, useSearchParams } from "next/navigation";

type Message = {
  id: number;
  message?: string;
  file?: string;
  sender_type: "Client" | "User";
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

  useEffect(() => {
    if (firstLoad && messages.length > 0) {
      endRef.current?.scrollIntoView({ block: "end" });
      setFirstLoad(false);
    }
  }, [messages, firstLoad]);
  
  // Handle incoming FCM message
  useFirebaseMessaging((payload) => {
    console.log("📨 Chat received FCM message:", payload);

    // Play notification sound (optional: add notification.mp3 to public folder)
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3; // Lower volume
      audio.play().catch(() => {
        // Fallback: use browser's built-in notification sound
        console.log("🔊 Playing notification sound");
      });
    } catch (error) {
      console.log("🔇 Could not play notification sound");
    }

    // Show notification toast
    addToast({
      title: "رسالة جديدة",
      description: payload.data?.message || "لديك رسالة جديدة",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
      variant: "solid",
      color: "warning",
    });

    // Increment new message counter
    setNewMessageCount((prev) => prev + 1);

    const incomingMessage: Message = {
      id: Date.now(),
      message: payload.data?.message,
      file: payload.data?.file,
      sender_type: "User",
    };
    setMessages((prev) => [...prev, incomingMessage]);
  });

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
      setIsFetching(false); // انتهى التحميل
    }
  };

  fetchMessages();
}, [offset]);

  // Initialize messages from API data
  useEffect(() => {
    if (messages && messages.length === 0) {
      setMessages(messages);
    }
  }, [messages, messages.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetInput = () => {
    setInput("");
    setSelectedFile(null);
  };

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
      };
      setMessages((prev) => [...prev, newMessage]);
      resetInput();

      // Clear new message counter when user sends a message
      setNewMessageCount(0);
    } catch (err) {
      console.error("Error sending message:", err);

      // Show error notification
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

    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50; // 50px tolerance
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
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

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scroll" onScroll={handleScroll}
        ref={scrollRef}>
        {isFetching && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {messages.map((msg: any) => (
          <div className="flex flex-col gap-2" key={msg.id}>
            <div
            className={`flex ${msg.sender_type === "Client" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`p-3 rounded-2xl max-w-[70%] shadow ${
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
          <span className={`text-start text-xs font-bold text-[#3D5066] flex ${msg.sender_type === "Client" ? "justify-end" : "justify-start"}`}>
                  {msg?.created_at
                    ? new Date(msg.created_at).toLocaleString(
                        "ar-EG",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        }
                      )
                    : ""}
                </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white flex items-center gap-2 border-t">
        <Button onPress={sendMessage} className="rounded-full" isIconOnly>
          <Microphone size={20} />
        </Button>

        {/* File Input */}
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

        {/* File Preview */}
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

        {/* Text Input */}
        <Input
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />

        {/* Send Button */}
        <Button onPress={sendMessage} className="rounded-full" isIconOnly>
          <Send2 size={20} />
        </Button>
      </div>
    </div>
  );
};
