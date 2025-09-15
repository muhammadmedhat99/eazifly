"use client";
import { Loader } from "@/components/global/Loader";
import { axios_config } from "@/lib/const";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { fetchClient } from "@/lib/utils";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { useState, useEffect } from "react";
import { useFirebaseMessaging } from "@/lib/hooks/useFirebaseMessaging";
import { useRouter } from "next/navigation";

type Message = {
  id: number | string
  chat_id: number | string
  sender_type: "User" | "Client" | string
  message: string
  created_at: string
  file?: string | null
  file_type?: string | null
}

type ChatResponse = {
  id: number;
  participant1: { type: string; id: string; name: string; image: string | null };
  participant2: { type: string; id: string; name: string; image: string | null };
  created_at: string;
  latest_message?: Message
};

export const Messages = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const router = useRouter();

  const { data: ChatList, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/get/chats?type=client`, axios_config),
    queryKey: ["GetChats"],
  });

  useEffect(() => {
    if (ChatList?.data) {
      setChats(ChatList.data);
    }
  }, [ChatList?.data]);

  useFirebaseMessaging((payload) => {
    console.log("📩 New Message in Chat List:", payload);

    const chatId = Number(payload.data?.chat_id);
    const newMessage = payload.data?.message;

    
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              latest_message: {
                id: Date.now(),
                chat_id: chatId,
                sender_type: payload.data?.sender_type || "User",
                message: newMessage ?? "", 
                created_at: new Date().toISOString(),
                file: payload.data?.file,
                file_type: payload.data?.file_type,
              },
            }
          : chat
      )
    );
  });

  return (
    <>
      {/* 🔍 Search + Filter */}
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="relative md:min-w-80">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchNormal1
                size="18"
                className="text-gray-400"
                variant="Outline"
              />
            </div>
            <input
              type="text"
              placeholder="بحث..."
              className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dropdown classNames={{ content: "min-w-36" }} showArrow>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="primary"
                className="text-primary font-semibold gap-1"
                radius="sm"
              >
                <ArrowDown2 size={14} />
                ترتيب حسب
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="name">الإسم</DropdownItem>
              <DropdownItem key="date">التاريخ</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex gap-2">
          <Button
            id="1"
            variant="flat"
            color={selectedStatus === "1" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            الكل
          </Button>
          <Button
            id="2"
            variant="flat"
            color={selectedStatus === "2" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            مقروء
          </Button>
          <Button
            id="3"
            variant="flat"
            color={selectedStatus === "3" ? "primary" : "default"}
            className="font-semibold"
            onPress={(e) => setSelectedStatus(e.target.id)}
          >
            غير مقروء
          </Button>
        </div>
      </div>

      {/* 📩 Chats List */}
      <div className="bg-main">
        {isLoading ? (
          <Loader />
        ) : chats.length > 0 ? (
          chats
            .filter((c) =>
              c.participant2.name
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat.id}
                className="flex justify-between border-b p-5 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                        router.push(`/messages/${chat.id}?user=${chat.participant2.id}`)
                    }
              >
                <div className="flex items-center gap-3">
                  <User
                    avatarProps={{
                      radius: "full",
                      src: chat.participant2.image || "",
                      size: "md",
                    }}
                    description={
                      <span className="text-sm font-semibold text-[#3D5066]">
                        {chat.latest_message
                          ? (chat.latest_message.message ||
                            (chat.latest_message.file ? "📎 مرفق" : "—"))
                          : "انقر لبدء المحادثة"}
                      </span>
                    }
                    name={
                      <span className="text-start text-sm font-bold">
                        {chat.participant2.name}
                      </span>
                    }
                  />
                </div>
                <span className="text-start text-xs font-bold text-[#3D5066]">
                  {chat.latest_message?.created_at
                    ? new Date(chat.latest_message.created_at).toLocaleString(
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
            ))
        ) : (
          <p className="text-center p-5 text-gray-500">لا توجد محادثات</p>
        )}
      </div>
    </>
  );
};

