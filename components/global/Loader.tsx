import { Spinner } from "@heroui/react";

export const Loader = () => {
  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <Spinner size="lg" color="primary" />
    </div>
  );
};
