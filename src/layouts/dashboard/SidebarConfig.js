import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import peopleFill from "@iconify/icons-eva/people-fill";
import lockFill from "@iconify/icons-eva/lock-fill";
import personAddFill from "@iconify/icons-eva/person-add-fill";
import alertTriangleFill from "@iconify/icons-eva/alert-triangle-fill";
import settingsFill from "@iconify/icons-eva/settings-fill";
import clipboardTaskListLtr20Filled from "@iconify/icons-fluent/clipboard-task-list-ltr-20-filled";
import awardIcon from "@iconify/icons-fa-solid/award";
import umbrellaBeach from "@iconify/icons-fa-solid/umbrella-beach";

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: "dashboard",
    path: "/home",
    icon: getIcon(pieChart2Fill),
  },
  {
    title: "associates",
    icon: getIcon(peopleFill),
    children: [
      {
        title: "all associates",
        path: "/associates/",
      },
      {
        title: "New Associate",
        path: "/associates/newassociate",
      },
    ],
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: getIcon(clipboardTaskListLtr20Filled),
  },
  {
    title: "Time Off",
    path: "/timeoff",
    icon: getIcon(umbrellaBeach),
  },
  {
    title: "My Team",
    path: "/myteam",
    icon: getIcon(peopleFill),
  },
  {
    title: "Hierarchy",
    path: "/hierarchy",
    icon: getIcon(peopleFill),
  },
  {
    title: "Thanks",
    path: "/thanks",
    icon: getIcon(awardIcon),
    children: [
      {
        title: "all thanks",
        path: "/thanks",
      },
      {
        title: "Give thanks",
        path: "/thanks/givethanks",
      },
    ],
  },
  {
    title: "admin",
    path: "/admin",
    icon: getIcon(settingsFill),
    children: [
      {
        title: "Database",
        path: "/admin/database",
      },
    ],
  },
];

export default sidebarConfig;
