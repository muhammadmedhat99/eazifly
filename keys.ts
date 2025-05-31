import { axios_config } from "./lib/const";

export const AllQueryKeys = {
  GetAllUsers: (search: string) => ['GetAllUsers', axios_config, search],
  GetUserById: (id: string) => ['GetUserById', id],
  GetAllStudentSubscriptions: (search: string) => ['GetAllStudentSubscriptions', axios_config, search],
  GetSubscriptionRequestById: (postId: string | number) => ['GetSubscriptionRequestById', postId],
  GetAllCountries: ["GetAllCountries", axios_config],
  GetAllPrograms: (search: string, currentPage: number) => ['GetAllPrograms', axios_config, search, currentPage]
};