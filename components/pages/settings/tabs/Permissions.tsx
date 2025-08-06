import { Select, SelectItem } from "@heroui/react";
import React from "react";
import { PermissionCollapse } from "../PermissionCollapse";
import { useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { fetchClient } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { Loader } from "@/components/global/Loader";

const permissionsList = [
  { title: "Admin", permissions: ["Create", "Delete", "Update", "View"] },
  { title: "User", permissions: ["Create", "Delete", "Update", "View"] },
  { title: "Roles", permissions: ["Create", "Delete", "Update", "View"] },
  { title: "Newsletter", permissions: ["Create", "Delete", "Update", "View"] },
];

export const Permissions = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryFn: async () => await fetchClient(`client/get/roles`, axios_config),
    queryKey: AllQueryKeys.GetAllRoles,
  });

  const { data: permissionsData, isLoading: isPermissionsLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/get/permission`, axios_config),
    queryKey: AllQueryKeys.GetAllPermissions,
  });
  console.log(permissionsData);

  const { data: actionsData, isLoading: isActionsLoading } = useQuery({
    queryFn: async () => await fetchClient("client/get/actions", axios_config),
    queryKey: AllQueryKeys.GetAllActions,
  });

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="flex flex-col relative touch-none tap-highlight-transparent select-none w-full bg-content1 border border-stroke max-w-full justify-between rounded-2xl gap-5 p-4 data-[selected=true]:border-success">
        <div className="flex flex-col gap-2">
          <div className="inline-flex justify-start items-center gap-1">
            <span className="text-[#272727] text-sm font-bold">
              إسم الوظيفة
            </span>
            <span className="text-primary text-xs font-bold">
              ( 42 صلاحية )
            </span>
          </div>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                aria-label="الوظيفة"
                selectedKeys={field.value ? [field.value] : [""]}
                onSelectionChange={(keys) => {
                  field.onChange(Array.from(keys)[0]);
                }}
                placeholder="اختر الوظيفة"
                classNames={{
                  label: "text-[#272727] font-bold text-sm",
                  base: "mb-4",
                  value: "text-[#87878C] text-sm",
                }}
                isDisabled={isRolesLoading || rolesData?.data.length === 0}
                isInvalid={!!errors?.role?.message}
                errorMessage={errors?.role?.message as string}
              >
                {(rolesData?.data as { id: number; name: string }[])?.map(
                  (role) => <SelectItem key={role.id}>{role.name}</SelectItem>
                )}
              </Select>
            )}
          />
        </div>
        <span className="text-[#272727] text-sm font-bold "> الصلاحيات</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {isPermissionsLoading || isActionsLoading ? (
            <Loader />
          ) : (
            permissionsData?.data?.map((permission: string) => (
              <PermissionCollapse
                key={permission}
                title={permission}
                permissions={actionsData?.data ?? []}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
