import { Input, Spinner } from "@heroui/react";
import { Control, Controller } from "react-hook-form";
import { JoditInput } from "./JoditInput";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/utils";
import { axios_config } from "@/lib/const";
import { AllQueryKeys } from "@/keys";

interface LocalizedFieldProps {
  control: Control<any>;
  name: string; // This should be the base path like "subscriptions.0.localizedFields"
  label: string;
  fieldName?: string; // This should be the specific field like "title", "label", etc.
  className?: string;
}

export const LocalizedField: React.FC<LocalizedFieldProps> = ({
  control,
  name,
  fieldName,
  label,
}) => {
  const { data: languagesData, isLoading } = useQuery({
    queryFn: async () => await fetchClient(`client/lang/setting`, axios_config),
    queryKey: AllQueryKeys.GetAllLanguages,
  });

  if (isLoading) return <Spinner/>;

  const languages =
    languagesData?.data
      ?.filter((langObj: any) => langObj.status === "true")
      ?.map((langObj: any) => langObj.lang) || [];

  return languages.map((lang: string) => (
    <Controller
      key={fieldName ? `${lang}.${fieldName}` : `${lang}.${name}`}
      name={
        fieldName
          ? `${name}.${lang}.${fieldName}`
          : `localizedFields.${lang}.${name}`
      }
      control={control}
      render={({ field, fieldState }) => (
        <Input
          label={`${label} (${lang.toUpperCase()})`}
          placeholder={`برجاء ادخال ${label} بال (${lang})`}
          type="text"
          {...field}
          isInvalid={!!fieldState.error?.message}
          errorMessage={fieldState.error?.message}
          labelPlacement="outside"
          classNames={{
            label: "text-[#272727] font-bold text-sm",
            inputWrapper: "shadow-none",
            base: "mb-4",
          }}
        />
      )}
    />
  ));
};

export const LocalizedTextArea: React.FC<LocalizedFieldProps> = ({
  control,
  name,
  fieldName,
  label,
  className,
}) => {
  const { data: languagesData, isLoading } = useQuery({
    queryFn: async () => await fetchClient(`client/lang/setting`, axios_config),
    queryKey: AllQueryKeys.GetAllLanguages,
  });

  if (isLoading) return <Spinner/>;

  const languages =
    languagesData?.data
      ?.filter((langObj: any) => langObj.status === "true")
      ?.map((langObj: any) => langObj.lang) || [];

  return languages.map((lang: string) => (
    <Controller
      key={fieldName ? `${lang}.${fieldName}` : `${lang}.${name}`}
      name={
        fieldName
          ? `${name}.${lang}.${fieldName}`
          : `localizedFields.${lang}.${name}`
      }
      control={control}
      render={({ field, fieldState }) => (
        <JoditInput
          value={field.value || ""}
          onChange={field.onChange}
          error={fieldState.error?.message}
          label={`${label} (${lang.toUpperCase()})`}
          className={className}
        />
      )}
    />
  ));
};
