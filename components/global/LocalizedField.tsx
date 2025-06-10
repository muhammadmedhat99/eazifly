import { Input } from "@heroui/react";
import { FormData } from "../pages/programs/create";
import { Control, Controller } from "react-hook-form";
import { JoditInput } from "./JoditInput";
const languages = ["ar", "en"] as const;

interface LocalizedFieldProps {
  control: Control<FormData>;
  name: keyof FormData["localizedFields"]["ar"];
  label: string;
}

export const LocalizedField: React.FC<LocalizedFieldProps> = ({
  control,
  name,
  label,
}) => {
  return languages.map((lang) => (
    <Controller
      key={`${lang}.${name}`}
      name={`localizedFields.${lang}.${name}`}
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
  label,
}) => {
  return languages.map((lang) => (
    <Controller
      key={`${lang}.${name}`}
      name={`localizedFields.${lang}.${name}`}
      control={control}
      render={({ field, fieldState }) => (
        <JoditInput
          value={field.value || ""}
          onChange={field.onChange}
          error={fieldState.error?.message}
          label={`${label} (${lang.toUpperCase()})`}
        />
      )}
    />
  ));
};
