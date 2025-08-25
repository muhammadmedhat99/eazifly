import { BreadCrumb } from "@/components/global/BreadCrumb";
import { QuestionsDetails } from "@/components/pages/programs/details/questions-details";
import { fetchData } from "@/lib/utils";
import { cookies } from "next/headers";
import React from "react";

export default async function Page({ params }: { params: Promise<{ id: string; questionId: string }> }) {
  const { id, questionId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const questionData = (await fetchData(`client/report/question/method/show/${questionId}`, token?.value)) as any;

  const BreadCrumbItems = [
    {
      id: 1,
      name: "الرئيسية",
      link: "/",
    },
    {
      id: 2,
      name: "أسئلة التقارير",
      link: `/programs/${id}`,
    },
    {
      id: 3,
      name: "السؤال",
    },
    {
      id: 4,
      name:
        `${questionData?.data?.title}`,
    },
  ];
  return (
    
    <>
      <BreadCrumb items={BreadCrumbItems} />

      <QuestionsDetails data={questionData} />
    </>
  );
}
