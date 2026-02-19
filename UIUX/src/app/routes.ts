import { createBrowserRouter } from "react-router";
import { LoadingPage } from "./pages/LoadingPage";
import { HomePage } from "./pages/HomePage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ManageInterestsPage } from "./pages/ManageInterestsPage";
import { ChatPage } from "./pages/ChatPage";
import { PageShowcase } from "./pages/PageShowcase";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoadingPage,
  },
  {
    path: "/showcase",
    Component: PageShowcase,
  },
  {
    path: "/home",
    Component: HomePage,
  },
  {
    path: "/chat/:chatId",
    Component: ChatPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/manage-interests",
    Component: ManageInterestsPage,
  },
]);