import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab
} from "@heroui/react";
import { useState } from "react";
import { Action } from "./tabs/Action";
import { PersonalInfo } from "./tabs/PersonalInfo";
import { SubscriptionInfo } from "./tabs/SubscriptionInfo";
import { PreviousActions } from "./tabs/PreviousActions";
import { UserBehavior } from "./tabs/UserBehavior";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

export default function StudentModal({
  isOpen,
  onClose,
  student,
}: StudentModalProps) {
  const [selectedTab, setSelectedTab] = useState("info");
  const [scrollBehavior, setScrollBehavior] = useState<"inside" | "normal" | "outside">("inside");

  return (
    <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}  onOpenChange={(open) => !open && onClose()} size="4xl">
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-[#272727] flex justify-center">
              بيانات الطالب
            </ModalHeader>

            <ModalBody>
              <div className="flex w-full flex-col">
                <Tabs
                    aria-label="Options"
                    classNames={{
                    tabList: "w-full bg-main py-5",
                    tab: "w-fit",
                    cursor: "hidden",
                    tabContent:
                        "text-[#5E5E5E] text-sm font-bold group-data-[selected=true]:text-primary",
                    }}
                >
                    <Tab key="action" title="الإجراء">
                    <Action studentInfo={student} onClose={onClose}/>
                    </Tab>
                    <Tab key="personal" title="البيانات الشخصية">
                    <PersonalInfo studentInfo={student} />
                    </Tab>
                    <Tab key="subscription" title="بيانات اللإشتراك">
                    <SubscriptionInfo  studentInfo={student}/>
                    </Tab>
                    <Tab key="history" title="الإجراءات السابقة">
                    <PreviousActions studentInfo={student}/>
                    </Tab>
                    <Tab key="behavior" title="سلوك المستخدم">
                    <UserBehavior  />
                    </Tab>
                </Tabs>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
