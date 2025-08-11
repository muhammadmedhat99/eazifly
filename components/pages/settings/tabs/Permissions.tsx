import { addToast, Button, Select, SelectItem, Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { PermissionCollapse } from "../PermissionCollapse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { fetchClient, fetchData, postData } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { Loader } from "@/components/global/Loader";
import { getCookie } from "cookies-next";

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

  const { data: actionsData, isLoading: isActionsLoading } = useQuery({
    queryFn: async () => await fetchClient("client/get/actions", axios_config),
    queryKey: AllQueryKeys.GetAllActions,
  });


  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const { data: rolePermissions , isFetching: isRolePermissionsLoading } = useQuery({
    queryKey: ["rolePermissions", selectedRoleId],
    queryFn: async () => {
      if (!selectedRoleId) return [];
      const res = await fetchClient(`client/get/role/permission/${selectedRoleId}`, axios_config);
      return res.data?.map((perm: any) => perm.name) ?? [];
    },
    enabled: !!selectedRoleId,
  });

  const [allCheckedPermissions, setAllCheckedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedRoleId) return;

    fetchClient(`client/get/role/permission/${selectedRoleId}`, axios_config)
      .then((res: any) => {
        const rolePermissions = res.data?.permissions?.map((p: any) => p.name) || [];
        setAllCheckedPermissions(rolePermissions);
      })
      .catch(console.error);
  }, [selectedRoleId]);


  const handlePermissionsChange = (updated: string[]) => {
    setAllCheckedPermissions((prev) => {
      const merged = [...prev.filter((p) => !updated.some((u) => u.startsWith(p.split("_")[0]))), ...updated];
      return merged;
    });
  };

  const updateRole = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("role_id", selectedRoleId);
      allCheckedPermissions.forEach((perm) => {
        formdata.append("permissions[]", perm);
      });

      return postData("client/update/role/permission", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (data.message && typeof data.message === "object" && !Array.isArray(data.message)) {
        const messagesObj = data.message as Record<string, string[]>;

        Object.entries(messagesObj).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            addToast({
              title: `${field}: ${msg}`,
              color: "danger",
            });
          });
        });
      } else if (data.message !== "success") {
        addToast({
          title: "error",
          color: "danger",
        });
      } else {
        addToast({
          title: data?.message,
          color: "success",
        });
      }
    },
    onError: (error) => {
      console.log(" error ===>>", error);
      addToast({
        title: "عذرا حدث خطأ ما",
        color: "danger",
      });
    },
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
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const roleId = Array.from(keys)[0] as string;
                  field.onChange(roleId);
                  setSelectedRoleId(roleId); // نخزن الـ role المختار
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
          {isPermissionsLoading || isActionsLoading || isRolePermissionsLoading ? (
            <Loader />
          ) : (
            permissionsData?.data?.map((permission: string) => (
              <PermissionCollapse
                key={permission}
                title={permission}
                permissions={actionsData?.data ?? []}
                defaultChecked={rolePermissions ?? []}
                onChange={handlePermissionsChange}
              />
            ))
          )}
        </div>
        <div className="flex items-center justify-end gap-4 mt-8 col-span-2">

          <Button
            type="submit"
            variant="solid"
            color="primary"
            className="text-white"
            onPress={() => updateRole.mutate()}
            isDisabled={updateRole?.isPending}
          >
            {updateRole?.isPending && <Spinner color="white" size="sm" />}
            تعديل
          </Button>
        </div>
      </div>
    </div>
  );
};
