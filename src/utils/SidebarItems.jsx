import {
    Home, Users, Gift, Car, Settings, Clock,
    MapPin, ShieldUser, MapPinHouse, CalendarCog, MapPinPlus
} from "lucide-react";
import { LiaGiftsSolid } from "react-icons/lia";
import { FaPeopleArrows } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export const getSidebarItems = (t, role) => [
    {
        id: "dashboard",
        icon: Home,
        label: t("dashboard"),
        path: "/user/dashboard",
    },
    {
        id: "appointment",
        icon: FaPeopleArrows,
        label: t("appointment"),
        path: "/user/booking",
    },

    {
        id: "zone_time",
        icon: CalendarCog,
        label: t("zone_time_management"),
        children: [
            {
                id: "time",
                icon: Clock,
                label: t("time"),
                path: "/user/time",
            },
            {
                id: "zone",
                icon: MapPinHouse,
                label: t("zone"),
                path: "/user/zone",
            },
            {
                id: "time_zone",
                icon: MapPinPlus,
                label: t("time_zone"),
                path: "/user/time-fix",
            },
        ],
    },

    {
        id: "promotion",
        icon: Gift,
        label: t("promotion"),
        path: "/user/promotion",
    },
    {
        id: "reward",
        icon: LiaGiftsSolid,
        label: t("reward"),
        path: "/user/gift",
    },

    {
        id: "general",
        icon: Settings,
        label: t("general_management"),
        children: [
            {
                id: "car",
                icon: Car,
                label: t("car_info"),
                path: "/user/car",
            },
            {
                id: "customer",
                icon: Users,
                label: t("customer_info"),
                path: "/user/user",
            },
            ...(role === "super_admin"
                ? [
                    {
                        id: "branch",
                        icon: MapPin,
                        label: t("branch_info"),
                        path: "/user/branch",
                    },
                ]
                : []),
        ],
    },

    ...(role === "super_admin"
        ? [
            {
                id: "backend",
                icon: MdOutlineAdminPanelSettings,
                label: t("backend_management"),
                children: [
                    {
                        id: "admin",
                        icon: MdOutlineAdminPanelSettings,
                        label: t("admin_info"),
                        path: "/user/admin",
                    },
                    {
                        id: "employee",
                        icon: ShieldUser,
                        label: t("employee_info"),
                        path: "/user/employee",
                    },
                ],
            },
        ]
        : []),

    {
        id: "service",
        icon: Settings,
        label: t("service"),
        path: "/user/servicing",
    },
    {
        id: "report",
        icon: TbReportAnalytics,
        label: t("report"),
        path: "/user/report",
    },
];