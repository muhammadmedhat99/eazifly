import { addToast, Button, Select, SelectItem, Spinner } from "@heroui/react";
import React, { useState } from "react";
import { PermissionCollapse } from "../../PermissionCollapse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AllQueryKeys } from "@/keys";
import { axios_config } from "@/lib/const";
import { fetchClient, postData } from "@/lib/utils";
import { Loader } from "@/components/global/Loader";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export const Permissions = ({roleId} : any) => {
  const { data: permissionsData, isLoading: isPermissionsLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/get/permission`, axios_config),
    queryKey: AllQueryKeys.GetAllPermissions,
  });

  const { data: actionsData, isLoading: isActionsLoading } = useQuery({
    queryFn: async () => await fetchClient("client/get/actions", axios_config),
    queryKey: AllQueryKeys.GetAllActions,
  });

  const { data: rolePermissions, isFetching: isRolePermissionsLoading } =
    useQuery({
      queryKey: ["rolePermissions", roleId],
      queryFn: async () => {
        if (!roleId) return [];
        const res = await fetchClient(
          `client/get/role/permission/${roleId}`,
          axios_config
        );
        return res.data?.map((perm: any) => perm.name) ?? [];
      },
      enabled: !!roleId,
    });

  const [allCheckedPermissions, setAllCheckedPermissions] = useState<string[]>(
    []
  );

  const handlePermissionsChange = (updated: string[]) => {
    setAllCheckedPermissions((prev) => {
      const merged = [
        ...prev.filter(
          (p) => !updated.some((u) => u.startsWith(p.split("_")[0]))
        ),
        ...updated,
      ];
      return merged;
    });
  };

  const router = useRouter();
  const updateRole = useMutation({
    mutationFn: () => {
      var myHeaders = new Headers();
      myHeaders.append("local", "ar");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);
      var formdata = new FormData();
      formdata.append("role_id", roleId ?? "");
      allCheckedPermissions.forEach((perm) => {
        formdata.append("permissions[]", perm);
      });

      return postData("client/update/role/permission", formdata, myHeaders);
    },
    onSuccess: (data) => {
      if (
        data.message &&
        typeof data.message === "object" &&
        !Array.isArray(data.message)
      ) {
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
        router.push('/hr/roles')
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
        
        <span className="text-[#272727] text-sm font-bold "> الصلاحيات</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {isPermissionsLoading ||
          isActionsLoading ||
          isRolePermissionsLoading ? (
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
            حفظ
          </Button>
        </div>
      </div>
    </div>
  );
};
