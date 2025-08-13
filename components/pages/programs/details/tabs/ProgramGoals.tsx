import { Accordion, AccordionItem, Button } from "@heroui/react";
import { ArrowLeft2, Menu, Trash } from "iconsax-reactjs";
import React, { useState } from "react";
import CreateProgramContent from "../../ProgramContentModals/CreateProgramContent";
import { useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { useParams } from "next/navigation";
import { Loader } from "@/components/global/Loader";
import CreateProgramChapter from "../../ProgramContentModals/CreateProgramChapter";
import Image from "next/image";
import CreateProgramLesson from "../../ProgramContentModals/CreateProgramLesson";
import Link from "next/link";

export const ProgramGoals = () => {
  const params = useParams();
  const program_id = params.id;

  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [chaptermodalOpen, setChapterModalOpen] = useState(false);
  const [lessonmodalOpen, setLessonModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: AllQueryKeys.GetAllProgramContents,
    queryFn: async () =>
      await fetchClient(`client/program/contents/${program_id}`, axios_config),
  });

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="py-2 bg-main">
        <CreateProgramContent
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <CreateProgramChapter
          isOpen={chaptermodalOpen}
          onClose={() => setChapterModalOpen(false)}
          content_id={selectedContentId}
        />
        <CreateProgramLesson
          isOpen={lessonmodalOpen}
          onClose={() => setLessonModalOpen(false)}
          chapter_id={selectedChapterId}
        />
        <div className="flex items-center justify-end p-5 border-b border-b-stroke">
          <Button
            variant="flat"
            color="primary"
            className="font-semibold text-primary"
            onPress={() => setModalOpen(true)}
          >
            {data.data.length >= 1 ? `إضافة هدف أخر +`: `إضافة هدف +`}
          </Button>
        </div>
        {data.data.map((content: any, index: number) => (
          <div className="p-4" key={content.id}>
            <Accordion variant="splitted" defaultExpandedKeys={["0"]}>
              <AccordionItem
                key={index}
                aria-label="الاهداف"
                title={
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Menu
                        size="20"
                      />
                      <span>{content.title}</span>
                    </div>
                    <span

                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash color="red" size="20" />
                    </span>
                  </div>
                }
                classNames={{
                  title: "font-bold text-black-text text-[15px]",
                  base: "shadow-none border border-stroke",
                }}

              >
                <div className="py-5 grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                    <div className="flex flex-col gap-4">
                      <span className="text-[#5E5E5E] text-sm font-bold">
                        العنوان
                      </span>
                      <span className="text-black-text font-bold text-[15px]">
                        {content.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                    <div className="flex flex-col gap-4">
                      <span className="text-[#5E5E5E] text-sm font-bold">
                        الوصف
                      </span>
                      <span className="text-black-text font-bold text-[15px]" dir="rtl"
                        dangerouslySetInnerHTML={{ __html: content.description }}>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="flat"
                      color="primary"
                      className="font-semibold text-primary"
                      onPress={() => {
                        setChapterModalOpen(true);
                        setSelectedContentId(content.id);
                      }}
                    >
                      إضافة هدف فرعي +
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4" >
                {content.chapters.map((chapter: any) => (
                    <Accordion variant="splitted" key={chapter.id}>
                      <AccordionItem
                        key="1"
                        aria-label="الاهداف الفرعية "
                        title={
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Menu
                                size="20"
                              />
                              <span>{chapter.title}</span>
                            </div>
                            <span

                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash color="red" size="20" />
                            </span>
                          </div>
                        }
                        classNames={{
                          title: "font-bold text-black-text text-[15px]",
                          base: "shadow-none border border-primary border-3",
                        }}

                      >
                        <div className="py-5 grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                            <div className="flex flex-col gap-4">
                              <span className="text-[#5E5E5E] text-sm font-bold">
                                العنوان
                              </span>
                              <span className="text-black-text font-bold text-[15px]">
                                {chapter.title}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                            <div className="flex flex-col gap-4">
                              <span className="text-[#5E5E5E] text-sm font-bold">
                                الوصف
                              </span>
                              <span className="text-black-text font-bold text-[15px]" dir="rtl"
                                dangerouslySetInnerHTML={{ __html: chapter.description }}>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                          <div className="flex flex-col gap-4">
                            <span className="text-[#5E5E5E] text-sm font-bold">الملف</span>

                            {chapter.file_type === "pdf" ? (
                              <Link
                                href={chapter.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                عرض ملف PDF
                              </Link>
                            ) : (
                              <Image
                                src={chapter.file}
                                width={450}
                                height={450}
                                alt="file preview"
                                className="w-full h-full flex-1 object-cover rounded-xl"
                              />
                            )}
                          </div>

                          </div>
                          
                          <div className="flex items-center justify-end">
                            <Button
                              variant="flat"
                              color="primary"
                              className="font-semibold text-primary"
                              onPress={() => {
                                setLessonModalOpen(true);
                                setSelectedChapterId(chapter.id);
                              }}
                            >
                              إضافة درس  +
                            </Button>
                          </div>
                      
                        </div>

                      <div className="grid grid-cols-1 gap-4" >
                        {chapter.lessons.map((lesson: any) => (
                        <Accordion variant="splitted" key={lesson.id}>
                          <AccordionItem
                            key="1"
                            aria-label="الدروس"
                            title={
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Menu
                                    size="20"
                                  />
                                  <span>{lesson.title}</span>
                                </div>
                                <span className="text-sm font-bold text-success">{lesson.points} نقطة</span>
                                <span

                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash color="red" size="20" />
                                </span>
                              </div>
                            }
                            classNames={{
                              title: "font-bold text-black-text text-[15px]",
                              base: "shadow-none border border-success border-3",
                            }}

                          >
                            <div className="py-5 grid grid-cols-1 gap-4">
                              <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                                <div className="flex flex-col gap-4">
                                  <span className="text-[#5E5E5E] text-sm font-bold">
                                    الإنهاء من قبل
                                  </span>
                                  <span className="text-black-text font-bold text-[15px]">
                                    {lesson.is_finished}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                                <div className="flex flex-col gap-4">
                                  <span className="text-[#5E5E5E] text-sm font-bold">
                                    العنوان
                                  </span>
                                  <span className="text-black-text font-bold text-[15px]">
                                    {lesson.title}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-main p-5 rounded-2xl border border-stroke">
                                <div className="flex flex-col gap-4">
                                  <span className="text-[#5E5E5E] text-sm font-bold">
                                    الوصف
                                  </span>
                                  <span className="text-black-text font-bold text-[15px]" dir="rtl"
                                    dangerouslySetInnerHTML={{ __html: lesson.description }}>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AccordionItem>
                        </Accordion>
                      ))}
                      </div>

                      </AccordionItem>
                    </Accordion>
                ))}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

    </>
  );
};

