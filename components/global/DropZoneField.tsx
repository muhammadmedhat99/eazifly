import { FolderOpen } from "iconsax-reactjs";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

type DropzoneFieldProps = {
  value?: File[];
  onChange: (files: File[]) => void;
  error?: string;
  multiple?: boolean;
  label?: string;
  description?: string;
};

export const DropzoneField = ({
  value = [],
  onChange,
  error,
  multiple = false,
  label,
  description,
}: DropzoneFieldProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = multiple ? [...value, ...acceptedFiles] : acceptedFiles;
      onChange(newFiles);
    },
    [onChange, value, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  useEffect(() => {
    if (!value) return;

    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

  return (
    <div {...getRootProps()} className="flex flex-col gap-1">
      <label className="text-[#272727] font-bold text-sm">{label} </label>
      <div className="border border-dashed p-4 rounded-xl cursor-pointer text-center mb-4 border-primary flex items-center flex-col gap-2 bg-input/50">
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex items-center flex-col gap-2">
            <FolderOpen size="32" className="text-primary" variant="Bold" />
            <h6 className="text-primary font-bold">
              {description || "تحميل صورة او فيديو"}
            </h6>
            <p className="font-semibold text-gray-500 text-xs">
              قم بإفلات الملف هنا ...
            </p>
          </div>
        ) : value?.length ? (
          <div className="flex items-center flex-col gap-2">
            {value.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const url = URL.createObjectURL(file);
              return (
                <div key={index} className="w-full">
                  {isImage ? (
                    <Image
                      src={url}
                      alt={file.name}
                      width={1024}
                      height={1024}
                      className="w-full h-40 rounded-sm object-cover"
                    />
                  ) : (
                    <p className="font-semibold text-gray-500 text-xs">
                      {file.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center flex-col gap-2">
            <FolderOpen size="32" className="text-primary" variant="Bold" />
            <h6 className="text-primary font-bold">
              {description || "تحميل صورة او فيديو"}
            </h6>
            <p className="font-semibold text-gray-500 text-xs">
              آو آضغط للتصفح (الحد الآقصي 10 ميجا)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
    </div>
  );
};
