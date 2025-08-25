"use client";

import { useState } from "react";
import { Input, Button, Avatar, Card } from "@heroui/react";
import { Image, Microphone, Send2, VoiceCricle } from "iconsax-reactjs";

export const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "مثال: هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال النص.", type: "received" },
    { id: 2, text: "مثال: هذا النص هو جزء من عملية تحسين تجربة المستخدم من خلال النص.", type: "sent" },
    // { id: 3, text: "فويس مسج", type: "received", audio: true },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, type: "sent" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`p-3 rounded-2xl max-w-[70%] bg-white text-black shadow rounded-bl-none`}
            >
              {msg.audio ? (
                <audio controls className="w-40">
                  <source src="test-audio.mp3" type="audio/mpeg" />
                </audio>
              ) : (
                msg.text
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white flex items-center gap-2 border-t">
        <Button onPress={sendMessage} className="rounded-full" isIconOnly>
          <Microphone size={20} />
        </Button>
        <Button onPress={sendMessage} className="rounded-full" isIconOnly>
          <Image size={20} />
        </Button>
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
}
