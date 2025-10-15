"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { fetchClient, postData } from "@/lib/utils";
import { axios_config } from "@/lib/const";

export const WordWall = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [games, setGames] = useState<any[]>([]);
  const [newGame, setNewGame] = useState({
    title: "",
    word_wall_games_category_id: "",
    iframe_url: "",
  });

  const [editGame, setEditGame] = useState<any>(null);
  const [viewGame, setViewGame] = useState<any>(null);

  // ===== Get All Games =====
  const { data: gamesData } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/word/wall/games`, axios_config),
    queryKey: ["GetAllGames"],
  });

  useEffect(() => {
    if (gamesData?.data) setGames(gamesData.data);
  }, [gamesData]);

  // ===== Get Categories =====
  const { data: categoriesData } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/word/wall/games/category`, axios_config),
    queryKey: ["GetAllCategories"],
  });

  // ===== Add Game =====
  const AddGame = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(`client/word/wall/games/store`, JSON.stringify(payload), myHeaders);
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({ title: "حدث خطأ أثناء الإضافة", color: "danger" });
      } else {
        addToast({ title: "تمت الإضافة بنجاح", color: "success" });
        setIsModalOpen(false);
        setNewGame({ title: "", word_wall_games_category_id: "", iframe_url: "" });
        queryClient.invalidateQueries({ queryKey: ["GetAllGames"] });
      }
    },
    onError: () => addToast({ title: "عذراً، حدث خطأ ما", color: "danger" }),
  });

  const handleAddGame = () => {
    if (!newGame.title || !newGame.word_wall_games_category_id || !newGame.iframe_url) {
      addToast({ title: "يرجى تعبئة جميع الحقول", color: "warning" });
      return;
    }
    AddGame.mutate(newGame);
  };

  // ===== Edit Game =====
  const handleEdit = (game: any) => {
    setEditGame(game);
    setIsEditModalOpen(true);
  };

  const UpdateGame = useMutation({
    mutationFn: async (payload: any) => {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      myHeaders.append("Content-Type", "application/json");

      return postData(
        `client/word/wall/games/update/${payload.id}`,
        JSON.stringify(payload.body),
        myHeaders
      );
    },
    onSuccess: (response) => {
      if (response.message !== "success") {
        addToast({ title: "حدث خطأ أثناء التعديل", color: "danger" });
      } else {
        addToast({ title: "تم التعديل بنجاح", color: "success" });
        setIsEditModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["GetAllGames"] });
      }
    },
    onError: () => addToast({ title: "عذراً، حدث خطأ ما", color: "danger" }),
  });

  const handleUpdateSubmit = () => {
    if (!editGame) return;
    const payload = {
      id: editGame.id,
      body: {
        title: editGame.title,
        word_wall_games_category_id: editGame.word_wall_games_category_id,
        iframe_url: editGame.iframe_url,
      },
    };
    UpdateGame.mutate(payload);
  };

  // ===== View Game =====
  const handleView = (game: any) => {
    setViewGame(game);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800">الألعاب</h2>
        <Button color="primary" className="text-white" onPress={() => setIsModalOpen(true)}>
          إضافة لعبة
        </Button>
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 gap-4">
        {games.map((game, index) => (
          <div
            key={index}
            className="border border-stroke rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => handleView(game)}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base sm:text-lg text-gray-800">
                {game.title}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => handleEdit(game)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                >
                  حذف
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-bold text-gray-600">الفئة: </span>
                {game.category?.title}
              </p>
              <p className="truncate">
                <span className="font-bold text-gray-600">الرابط (iframe): </span>
                {game.iframe_url}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Game Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="lg">
        <ModalContent>
          <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
            إضافة لعبة جديدة
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-6">
              <Input
                label="عنوان اللعبة"
                value={newGame.title}
                onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                placeholder="أدخل عنوان اللعبة"
                variant="bordered"
                labelPlacement="outside"
              />

              <Select
                label="الفئة"
                selectedKeys={
                  newGame.word_wall_games_category_id
                    ? new Set([String(newGame.word_wall_games_category_id)])
                    : new Set()
                }
                onSelectionChange={(keys: any) => {
                  const selectedVal = Array.from(keys)[0] as string | undefined;
                  setNewGame({
                    ...newGame,
                    word_wall_games_category_id: selectedVal || "",
                  });
                }}
                placeholder="اختر الفئة"
                labelPlacement="outside"
              >
                {categoriesData?.data?.map((cat: any) => (
                  <SelectItem key={cat.id}>{cat.title}</SelectItem>
                ))}
              </Select>

              <Input
                label="رابط الـ iframe"
                value={newGame.iframe_url}
                onChange={(e) => setNewGame({ ...newGame, iframe_url: e.target.value })}
                placeholder="أدخل رابط iframe"
                variant="bordered"
                labelPlacement="outside"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="text-white"
              onClick={handleAddGame}
              isLoading={AddGame.isPending}
            >
              حفظ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Game Modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} size="lg">
        <ModalContent>
          <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
            تعديل اللعبة
          </ModalHeader>
          <ModalBody>
            {editGame && (
              <div className="flex flex-col gap-6">
                <Input
                  label="عنوان اللعبة"
                  value={editGame.title}
                  onChange={(e) =>
                    setEditGame({ ...editGame, title: e.target.value })
                  }
                  variant="bordered"
                  labelPlacement="outside"
                />

                <Select
                  label="الفئة"
                  selectedKeys={
                    editGame.word_wall_games_category_id
                      ? new Set([String(editGame.word_wall_games_category_id)])
                      : new Set()
                  }
                  onSelectionChange={(keys: any) => {
                    const selectedVal = Array.from(keys)[0] as string | undefined;
                    setEditGame({
                      ...editGame,
                      word_wall_games_category_id: selectedVal || "",
                    });
                  }}
                  labelPlacement="outside"
                >
                  {categoriesData?.data?.map((cat: any) => (
                    <SelectItem key={cat.id}>{cat.title}</SelectItem>
                  ))}
                </Select>

                <Input
                  label="رابط الـ iframe"
                  value={editGame.iframe_url}
                  onChange={(e) =>
                    setEditGame({ ...editGame, iframe_url: e.target.value })
                  }
                  variant="bordered"
                  labelPlacement="outside"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="text-white"
              onClick={handleUpdateSubmit}
              isLoading={UpdateGame.isPending}
            >
              حفظ التعديلات
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Game Modal */}
      <Modal isOpen={isViewModalOpen} onOpenChange={setIsViewModalOpen} size="4xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
            عرض اللعبة
          </ModalHeader>
          <ModalBody>
            {viewGame && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg">{viewGame.title}</h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-bold">الفئة:</span> {viewGame.category?.title}
                </p>
                <div
            className="w-full flex justify-center"
            dangerouslySetInnerHTML={{ __html: viewGame.iframe_url }}
          />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onClick={() => setIsViewModalOpen(false)}>
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
