"use client";

import Timeline from "@/components/global/Timeline";
import { Card } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArchiveAdd } from "iconsax-reactjs";
import React from "react";

type ContentItem = {
  id: number;
  program_id: number;
  program: string;
  title: string;
  description: string | null;
  duration: string;
  type: string;
  status: string;
  sort: string;
  created_at: string | null;
};

// props بتاعة SessionContent: array
type ContentDataProps = {
  contentData: ContentItem[];
};

export const SessionContent = ({ contentData }: ContentDataProps) => {

  return (
    <div className="p-5">
      <Card className="p-10 w-2/3 m-auto">
        <Timeline data={contentData} />
      </Card>
    </div>
  );
};
