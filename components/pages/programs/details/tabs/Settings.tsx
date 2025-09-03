"use client";

import { useEffect, useState } from "react";
import { Checkbox, RadioGroup, Radio, Button, addToast, Switch, Input } from "@heroui/react";
import { fetchClient, postData } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";

export const Settings = () => {
    const [filterType, setFilterType] = useState<string>("all");
    const [discountEnabled, setDiscountEnabled] = useState(false);
    const [discountValue, setDiscountValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Selected Filter:", filterType);
        updateSettings.mutate(filterType);
    };

    const updateSettings = useMutation({
        mutationFn: (submitData: any) => {
            console.log("submitData", submitData);
            
            const myHeaders = new Headers();
            myHeaders.append("local", "ar");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

            const payload = {
                settings: [{
                    key: "plans_display",
                    value: submitData,
                    label_name: "plans_display",
                }],
            };

            return postData("client/setting/update", JSON.stringify(payload), myHeaders);
        },
        onSuccess: (data) => {
          if (data.message !== "success") {
            addToast({ title: "error", color: "danger" });
          } else {
            addToast({ title: data.message, color: "success" });
            refetch();
          }
        },
        onError: () => {
          addToast({ title: "عذرا حدث خطأ ما", color: "danger" });
        },
      });

      const { data: settingData, isLoading, refetch } = useQuery({
          queryKey: AllQueryKeys.GetAllSettings,
          queryFn: async () => await fetchClient(`client/setting`, axios_config),
        });

    useEffect(() => {
        if (settingData) {
            const plansDisplay = settingData?.data.find(
                (s: any) => s.key === "plans_display"
            );
            if (plansDisplay) {
                setFilterType(plansDisplay.value); 
            }
        }
    }, [settingData]);

    return (
         <div className="p-5 space-y-6">
            <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-2">
                <h2 className="text-xl font-bold mb-4">طريقة عرض خطط الاشتراك</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <RadioGroup
                        value={filterType}
                        onValueChange={setFilterType}
                    >
                        <Radio value="all">عرض كل خطط الاشتراك (تصفية)</Radio>
                        <Radio value="special">عرض الباقات المميزة فقط</Radio>
                    </RadioGroup>


                    <div className="flex items-center justify-end gap-4 mt-8 md:col-span-2">
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            className="text-white"
                        >
                            حفظ
                        </Button>
                    </div>
                </form>
            </div>
            <div className="bg-white border border-stroke rounded-xl px-5 py-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2">خصم الطلاب المتعددين</h2>

                <Switch
                    isSelected={discountEnabled}
                    onValueChange={setDiscountEnabled}
                    color="primary"
                >
                    تفعيل الخصم
                </Switch>

                {discountEnabled && (
                    <Input
                        type="number"
                        label="نسبة الخصم (%)"
                        placeholder="ادخل قيمة الخصم"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        min={1}
                        max={100}
                    />
                )}
                <div className="flex items-center justify-end gap-4 mt-8 md:col-span-2">
                    <Button
                        variant="solid"
                        color="primary"
                        className="text-white"
                    >
                        حفظ
                    </Button>
                </div>
            </div>
        </div>
    );
};
