import { useState } from "react";

// Define TypeScript interfaces for our data
interface TimelineItem {
  id: string;
  timestamp: string;
  type: "note" | "new_employee";
  title: string;
  content?: string;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

interface TimelineProps {
  items: TimelineItem[];
}

type StudentDetailsProps = {
  actionsData: {
    data: {
      id: number;
      title: string,
      description: string,
      created_at: string,
      instructor: {
        id: number;
        name_ar: string;
        name_en: string;
        image: string;
      },
      user: {
        id: number;
        first_name: string;
        last_name: string;
        image: string;
      },
      client: {
        id: number;
        name: string;
        image: string;
      },
      
    }[];
  }
  
}

// Main Timeline Component
export default function Timeline({ items = [] }: TimelineProps) {
  // Check if items exists and is an array before spreading
  const itemsArray = Array.isArray(items) ? items : [];
  const sortedItems = [...itemsArray].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute top-10 bottom-10 right-4 w-px bg-primary"></div>

      {/* Timeline items */}
      <div className="space-y-6">
        {sortedItems.map((item) => (
          <TimelineEntry key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// Individual Timeline Entry Component
function TimelineEntry({ item }: { item: TimelineItem }) {
  const isNote = item.type === "note";
  const isNewEmployee = item.type === "new_employee";

  // Format the timestamp (you could add a more sophisticated formatter)
  const formattedDate = new Date(item.timestamp).toLocaleDateString("ar-SA");
  const formattedTime = new Date(item.timestamp).toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="relative flex items-start">
      {/* Timeline dot */}
      <div className="absolute -right-4 transform -translate-x-1/2 top-10">
        <div className="size-8 rounded-full bg-background flex items-center justify-center">
          <div className="bg-primary/10 size-6 rounded-full flex items-center justify-center">
            <div className="size-2.5 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content card */}
      <div className="mx-10 bg-main rounded-2xl border border-stroke p-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-black-text font-bold text-sm">{item.title}</h3>
            {item.content && (
              <div className="mt-2 text-[#3D5066] font-bold text-xs">
                {item.content}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {item.timestamp && (
              <span className="text-primary font-semibold text-xs">
                {formattedTime} {formattedDate}
              </span>
            )}

            {item.author && (
              <div className="flex items-center">
                {item.author.avatar && (
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 ml-2">
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="text-right">
                  <div className="font-medium text-sm">{item.author.name}</div>
                  {item.author.role && (
                    <div className="text-gray-500 text-xs">
                      {item.author.role}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Render the Timeline with sample data
function TimelineDemo({ actionsData }: StudentDetailsProps) {
  const items: TimelineItem[] = actionsData.data.map((item) => {
    const hasInstructor = !!item.instructor;
    const hasClient = !!item.client;

    let authorName = "";
    let authorRole = "";
    let authorAvatar = "";

    if (hasInstructor) {
      authorName = item.instructor.name_ar || "غير معروف";
      authorRole = "المعلم";
      authorAvatar = item.instructor.image;
    } else if (hasClient) {
      authorName = item.client.name || "غير معروف";
      authorRole ="الإدارة";
      authorAvatar = item.client.image;
    }

    return {
      id: item.id.toString(),
      timestamp: item.created_at,
      type: "note",
      title: item.title,
      content: item.description,
      author: {
        name: authorName,
        role: authorRole,
        avatar: authorAvatar || "https://via.placeholder.com/150",
      },
    };
  });

  return (
    <div className="mx-auto my-8 px-4" dir="rtl">
      <Timeline items={items} />
    </div>
  );
}

export { Timeline, TimelineDemo };
TimelineDemo;
