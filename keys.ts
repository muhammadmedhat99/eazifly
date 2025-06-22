import { axios_config } from "./lib/const";

export const AllQueryKeys = {
  GetAllUsers: (search: string) => ['GetAllUsers', axios_config, search],
  GetUserById: (id: string) => ['GetUserById', id],
  GetAllStudentSubscriptions: (search: string) => ['GetAllStudentSubscriptions', axios_config, search],
  GetSubscriptionRequestById: (postId: string | number) => ['GetSubscriptionRequestById', postId],
  GetAllCountries: ["GetAllCountries", axios_config],
  GetAllResponses: ["GetAllResponses", axios_config],
  GetAllPrograms: (search: string, currentPage: number) => ['GetAllPrograms', axios_config, search, currentPage],
  GetAllSpecializations: ["GetAllSpecializations", axios_config],
  GetAllInstructors: ["GetAllInstructors", axios_config],
  GetAllPaymentMethods: ["GetAllPaymentMethods", axios_config],
  GetAllSubscriptionPeriods: ["GetAllSubscriptionsPeriods", axios_config],
  GetAllSessionTimes: ["GetAllSessionTimes", axios_config],
};