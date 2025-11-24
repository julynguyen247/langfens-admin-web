import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/global.css";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import AdminLayout from "./components/layout/layout.admin";
import Dashboard from "./pages/admin/dashboard";
import Users from "./pages/admin/users";
import "@ant-design/v5-patch-for-react-19";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";
import LoginPage from "./pages/admin/login";
import Speaking from "./pages/admin/speaking";
import Artists from "./pages/admin/artists";
import Genres from "./pages/admin/genres";
import Karaoke from "./pages/admin/karaoke";
import Exams from "./pages/admin/exams";
import Notifications from "./pages/admin/notifications";
import Writing from "./pages/admin/artists";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: AdminLayout,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "speaking",
        element: <Speaking />,
      },
      {
        path: "writing",
        element: <Writing />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "karaokes",
        element: <Karaoke />,
      },
      {
        path: "exams",
        element: <Exams />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
    ],
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <App>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>
  </App>
);
