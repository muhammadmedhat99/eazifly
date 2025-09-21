import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User, Spinner } from "@heroui/react";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function SearchUsers() {
    const router = useRouter();
    const [search, setSearch] = useState<{ id: string; name: string }>({ id: "", name: "" });
    const [searchType, setSearchType] = useState<"students" | "teachers">("students");

    const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
        queryFn: async () =>
            await fetchClient(`client/user?name=${search.name}`, { ...axios_config }),
        queryKey: ["users", "students", search.name],
        enabled: searchType === "students" && !!search.name,
    });

    const { data: teachersData, isLoading: isTeachersLoading } = useQuery({
        queryFn: async () =>
            await fetchClient(`client/instructors?name=${search.name}`, { ...axios_config }),
        queryKey: ["users", "teachers", search.name],
        enabled: searchType === "teachers" && !!search.name,
    });

    const CheckOrCreateChat = useMutation({
        mutationFn: async () => {
            const receiverTypeMap: Record<"students" | "teachers", string> = {
                students: "User",
                teachers: "Instructor",
            };

            const myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const formdata = new FormData();
            formdata.append("sender_type", "Client");
            formdata.append("sender_id", getCookie("client_id") as string);
            formdata.append("receiver_type", receiverTypeMap[searchType]);
            formdata.append("receiver_id", search.id as string);
            formdata.append("type", "group");

            return postData("client/check/chat", formdata, myHeaders);
        },
        onSuccess: (response) => {
            if (response?.data?.id) {
                router.push(`/messages/${response.data.id}?user=${search.id}`);
            }
        },
    });

    const currentData = searchType === "students" ? studentsData?.data : teachersData?.data;
    const isLoading = searchType === "students" ? isStudentsLoading : isTeachersLoading;

    return (
        <div className="flex gap-4 items-center">
            {searchType && (
                <div className="relative md:min-w-80">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {CheckOrCreateChat.isPending ? (
                            <Spinner size="sm" />
                        ) : (
                            <SearchNormal1 size="18" className="text-gray-400" variant="Outline" />
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder={searchType === "students" ? "بحث بالطلاب..." : "بحث بالمعلمين..."}
                        className="w-full py-2 h-11 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-light"
                        value={search.name}
                        onChange={(e) => setSearch({ id: "", name: e.target.value })}
                    />

                    {search.name && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {isLoading ? (
                                <div className="px-4 py-2 text-gray-500 text-sm">جاري التحميل...</div>
                            ) : currentData?.length > 0 ? (
                                currentData.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSearch({
                                                id: item.id,
                                                name:
                                                    searchType === "students"
                                                        ? `${item.first_name} ${item.last_name}`
                                                        : item.name,
                                            });
                                            CheckOrCreateChat.mutate();
                                        }}
                                    >
                                        <User
                                            avatarProps={{
                                                radius: "full",
                                                src: item.image || "",
                                                size: "sm",
                                            }}
                                            name={
                                                <span className="text-start text-sm font-bold">
                                                    {searchType === "students"
                                                        ? `${item.first_name} ${item.last_name}`
                                                        : item.name}
                                                </span>
                                            }
                                        />
                                    </div>
                                ))
                            ) : (
                                <span className="px-4 py-2 text-gray-500 text-sm block">لا يوجد نتائج للبحث</span>
                            )}
                        </div>
                    )}
                </div>
            )}

            <Dropdown classNames={{ content: "min-w-36" }} showArrow>
                <DropdownTrigger>
                    <Button
                        variant="flat"
                        color="primary"
                        className="text-primary font-semibold gap-1"
                        radius="sm"
                    >
                        <ArrowDown2 size={14} />
                        {searchType === "students"
                            ? "بحث بالطلاب"
                            : searchType === "teachers"
                                ? "بحث بالمعلمين"
                                : "اختر نوع البحث"}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Select search type"
                    onAction={(key) => {
                        setSearch({ id: "", name: "" });
                        setSearchType(key as any);
                    }}
                >
                    <DropdownItem key="students">الطلاب</DropdownItem>
                    <DropdownItem key="teachers">المعلمين</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
