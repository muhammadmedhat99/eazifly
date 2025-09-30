import { DropzoneField } from "@/components/global/DropZoneField";
import { postData } from "@/lib/utils";
import { Tabs, Tab, Select, SelectItem, Input } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { User } from "@heroui/react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";

type ChildUser = {
  user_id: string;
  name: string;
  age: string;
  image: string;
};

type ProgramData = {
  number_of_session_per_week: string[];
  duration: string[];
  subscripe_days: string[];
  subscripe_months: (string | null)[];
};

type Props = {
  children_users: ChildUser[];
  data: ProgramData | undefined;
  control: any;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  program_id: any;
};

const ProgramChangeComponent = ({
  children_users,
  data,
  control,
  selectedTab,
  setSelectedTab,
  program_id,
}: Props) => {
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!data) return null;

  const {
    subscripe_months,
    subscripe_days,
    number_of_session_per_week,
    duration,
  } = data;

  const tabsData = subscripe_months.map((month, index) => ({
    title: month ?? "-",
    value: subscripe_days[index] || "",
  }));

  const watchedValues = useWatch({
    control,
    name: ["subscripe_days", "number_of_session_per_week", "duration"],
  });

  const fetchPlanPrice = async (formValues: any) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

      const formdata = new FormData();
      formdata.append("subscripe_days", formValues.subscripe_days);
      formdata.append("program_id", program_id);
      formdata.append("number_of_session_per_week", formValues.number_of_session_per_week);
      formdata.append("duration", formValues.duration);

      const res = await postData("client/program/plan", formdata, myHeaders);

      if (res.data?.discount_price) {
        setDiscountPrice(res.data.discount_price);
        setErrorMsg("");
      } else {
        setDiscountPrice("");
        setErrorMsg(res.message || "خطة الاشتراك غير متاحة");
      }
    } catch (err) {
      console.error("Error fetching plan price", err);
      setDiscountPrice("");
      setErrorMsg("حدث خطأ أثناء جلب السعر");
    }
  };


  useEffect(() => {
    const [subscripe_days, number_of_session_per_week, duration] = watchedValues;

    if (subscripe_days && program_id && number_of_session_per_week && duration) {
      fetchPlanPrice({
        subscripe_days,
        number_of_session_per_week,
        duration,
      });
    }
  }, [watchedValues, program_id]);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[#272727] font-bold text-sm block">
        خطة الإشتراك
      </label>
      <Controller
        name="subscripe_days"
        control={control}
        defaultValue={tabsData[0]?.value || ""}
        render={({ field }) => (
          <Tabs
            selectedKey={field.value}
            onSelectionChange={(key) => {
              field.onChange(key);
              setSelectedTab(key as string);
            }}
            aria-label="sub-tabs"
            classNames={{
              cursor: "bg-primary",
              tabContent:
                "text-black-text text-sm font-bold group-data-[selected=true]:text-white",
              tabList: "bg-[#EAF0FD] w-full",
            }}
          >
            {tabsData.map((tab) => (
              <Tab key={tab.value} title={tab.title} className="w-full p-6" />
            ))}
          </Tabs>
        )}
      />
      <label className="text-[#272727] font-bold text-sm block">
        الطلاب التابعين
      </label>
      <Controller
        name="users_ids"
        control={control}
        defaultValue={children_users.map((child) => child.user_id)}
        render={({ field }) => (
          <div className="flex flex-col gap-3">
            {children_users.map((child) => {
              const isChecked = field.value?.includes(child.user_id);
              return (
                <div
                  key={child.user_id}
                  className="bg-background rounded-lg flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      isSelected={isChecked}
                      onChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, child.user_id]);
                        } else {
                          field.onChange(
                            field.value.filter(
                              (id: string) => id !== child.user_id
                            )
                          );
                        }
                      }}
                    />
                    <User
                      avatarProps={{
                        radius: "full",
                        src: child.image || "",
                        size: "md",
                      }}
                      description={
                        <span className="text-sm font-bold text-[#3D5066]">
                          {`${child.age} عام`}
                        </span>
                      }
                      name={
                        <span className="text-primary text-start text-xs font-bold">
                          {child.name}
                        </span>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Controller
          name="number_of_session_per_week"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="عدد حصص البرنامج"
              placeholder="اختر عدد الحصص"
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
              }}
            >
              {number_of_session_per_week.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="student_number"
          control={control}
          defaultValue={children_users.length}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={children_users.length}
              label="عدد الطلاب"
              placeholder="عدد الطلاب"
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
              }}
            />
          )}
        />

        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="مدة الحصة"
              placeholder="اختر المدة"
              labelPlacement="outside"
              classNames={{
                label: "text-[#272727] font-bold text-sm",
              }}
              endContent={
                <span className="text-black-text font-bold text-sm">دقيقة</span>
              }
            >
              {duration.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <DropzoneField
              value={field.value}
              onChange={field.onChange}
              label="صورة التحويل"
              description="تحميل صورة جديدة"
            />
          )}
        />
        <Controller
          name="amount_to_be_paid"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              isDisabled
              value={discountPrice || errorMsg}
              label="المبلغ المستحق"
              placeholder="0"
              labelPlacement="outside"
              endContent={
                discountPrice && (
                  <span className="text-black-text font-bold text-sm">ج.م</span>
                )
              }
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
                input: errorMsg ? "text-red-500 font-bold" : "text-black-text",
              }}
            />
          )}
        />

        <Controller
          name="paid"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="قيمة التحويل"
              placeholder="نص الكتابة"
              labelPlacement="outside"
              endContent={
                <span className="text-black-text font-bold text-sm">ج.م</span>
              }
              classNames={{
                label: "text-[#272727] font-bold text-sm",
                inputWrapper: "shadow-none",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProgramChangeComponent;
