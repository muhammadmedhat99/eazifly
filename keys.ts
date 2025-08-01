import { axios_config } from "./lib/const";

export const AllQueryKeys = {
  GetAllUsers: (nameSearch: string, phoneSearch: string, currentPage: number) => ['GetAllUsers', axios_config, nameSearch, phoneSearch, currentPage],
  GetUserById: (id: string) => ['GetUserById', id],
  GetAllStudentSubscriptions: (search: string, type?: string | null, status?: string | null, currentPage?: number) => ['GetAllStudentSubscriptions', axios_config, search,type, status, currentPage],
  GetSubscriptionRequestById: (postId: string | number) => ['GetSubscriptionRequestById', postId],
  GetAllCountries: ["GetAllCountries", axios_config],
  GetAllResponses: ["GetAllResponses", axios_config],
  GetAllPrograms: (search: string, currentPage: number) => ['GetAllPrograms', axios_config, search, currentPage],
  GetAllSpecializations: ["GetAllSpecializations", axios_config],
  GetAllHost: ["GetAllHost", axios_config],
  GetAllInstructors: (nameSearch: string, phoneSearch: string, currentPage: number) => ['GetAllInstructors', axios_config, nameSearch, phoneSearch, currentPage],
  GetAllPaymentMethods: ["GetAllPaymentMethods", axios_config],
  GetAllSubscriptionPeriods: ["GetAllSubscriptionsPeriods", axios_config],
  GetAllSessionTimes: ["GetAllSessionTimes", axios_config],
};