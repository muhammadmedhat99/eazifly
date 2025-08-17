import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";

export const useLanguages = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () =>
      await fetchClient(`client/lang/setting`, axios_config),
    queryKey: AllQueryKeys.GetAllLanguages,
  });

  const languages =
    data?.data
      ?.filter((langObj: any) => langObj.status === "true")
      ?.map((langObj: any) => langObj.lang) || [];

  return { languages, isLoading };
};
