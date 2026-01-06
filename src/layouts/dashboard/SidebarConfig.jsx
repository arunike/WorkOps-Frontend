import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import peopleFill from "@iconify/icons-eva/people-fill";
import personFill from "@iconify/icons-eva/person-fill";
import layersFill from "@iconify/icons-eva/layers-fill";
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
    title: "Dashboard",
    path: "/home",
    icon: getIcon(pieChart2Fill),
  },
  {
    title: "Associates",
    icon: getIcon(peopleFill),
    children: [
      {
        title: "All Associates",
        path: "/associates/",
      },
      {
        title: "New Associate",
        path: "/associates/newassociate",
      },
    ],
  },
  {
    title: "My Team",
    path: "/myteam",
    icon: getIcon(personFill),
  },
  {
    title: "Time Entry",
    icon: getIcon(clipboardTaskListLtr20Filled),
    children: [
      {
        title: 'My Entry',
        path: '/timeentry'
      },
      {
        title: 'Time Entry Approvals',
        path: '/approvals'
      }
    ]
  },
  {
    title: "Time Off",
    icon: getIcon(umbrellaBeach),
    children: [
      {
        title: "My Requests",
        path: "/timeoff",
      },
      {
        title: "Time Off Approvals",
        path: "/timeoff/approvals",
      }
    ]
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: getIcon(clipboardTaskListLtr20Filled),
  },
  {
    title: "Hierarchy",
    path: "/hierarchy",
    icon: getIcon(layersFill),
  },
  {
    title: "Thanks",
    path: "/thanks",
    icon: getIcon(awardIcon),
    children: [
      {
        title: "All Thanks",
        path: "/thanks",
      },
      {
        title: "Give Thanks",
        path: "/thanks/givethanks",
      },
    ],
  },
  {
    title: "Admin",
    path: "/admin",
    icon: getIcon(settingsFill),
    children: [
      {
        title: "Database",
        path: "/admin/database",
      },
      {
        title: "Sidebar Settings",
        path: "/admin/sidebar-settings",
      },
    ],
  },
];

export default sidebarConfig;
