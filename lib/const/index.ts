import { getCookie } from "cookies-next";
import {
  Profile2User,
  Teacher,
  DocumentText,
  Message,
  Money2,
  FolderOpen,
  MirroringScreen,
  Setting,
  Rank,
  Brodcast
} from "iconsax-reactjs";

export const routes = [
  {
    id: 1,
    name: "الطلاب",
    route: "/students",
    icon: Profile2User,
    sub_routes: [
      { id: 1, name: "بيانات الطلاب", route: "" },
      { id: 2, name: "اشتراكات الطلاب", route: "/subscriptions" },
    ],
  },
  {
    id: 2,
    name: "المعلمين",
    route: "/teachers",
    icon: Teacher,
    sub_routes: [
      { id: 1, name: "بيانات المعلمين", route: "" },
      { id: 2, name: "تحسين", route: "/improve" },
      { id: 3, name: "طلبات الإنضمام", route: "/requests" },
    ],
  },
  {
    id: 3,
    name: "البرامج",
    route: "/programs",
    icon: DocumentText,
    sub_routes: [
      { id: 1, name: "بيانات البرامج", route: "" },
      { id: 2, name: "إنشاء برنامج جديد", route: "/new" },
    ],
  },
  {
    id: 4,
    name: "الرسائل",
    route: "/messages",
    icon: Message,
  },
  {
    id: 5,
    name: "المعاملات المالية",
    route: "/financials",
    icon: Money2,
    sub_routes: [
      // Add sub routes here if needed
    ],
  },
  {
    id: 6,
    name: "الشكاوي",
    route: "/complaints",
    icon: FolderOpen,
  },
  {
    id: 7,
    name: "الدعايا",
    route: "/ads",
    icon: MirroringScreen,
  },
  {
    id: 8,
    name: "الموارد البشرية",
    route: "/hr",
    icon: Rank,
    sub_routes: [
      { id: 1, name: "الوظائف", route: "/jobs" },
      { id: 2, name: "الموظفين", route: "/employees" },
      { id: 3, name: "الرواتب", route: "/salaries" },
      { id: 4, name: "الأقسام", route: "/departments" },
    ],
  },
  {
    id: 9,
    name: "المتابعة",
    route: "/monitoring",
    icon: Brodcast,
    sub_routes: [
      { id: 1, name: "المحاضرات الحالية", route: "/current-lectures" },
      { id: 2, name: "تقارير المعلمين", route: "/teacher-reports" },
    ],
  },
  {
    id: 10,
    name: "الإعدادات",
    route: "/settings",
    icon: Setting,
  },
];

export const axios_config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    local: "en",
    Authorization: `Bearer ${getCookie("token")}`,
  },
};