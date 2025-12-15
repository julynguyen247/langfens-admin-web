import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/global.css";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import AdminLayout from "./components/layout/layout.admin";

import Users from "./pages/admin/users";
import LoginPage from "./pages/admin/login";
import Speaking from "./pages/admin/speaking";
import Writing from "./pages/admin/writing";
import Exams from "./pages/admin/exams";

import "@ant-design/v5-patch-for-react-19";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";

import Sections from "./components/admin/sections";
import Questions from "./components/admin/questions";
import Options from "./components/admin/options";
import DictionaryAdmin from "./components/admin/dictionary";
import Decks from "./pages/admin/decks";
import Cards from "./pages/admin/cards";
import DashboardPage from "./pages/admin/dashboard";

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
        element: <DashboardPage />, // 👈 DASHBOARD
      },
      // ✅ GIỮ NGUYÊN
      { path: "users", element: <Users /> },
      { path: "speaking", element: <Speaking /> },
      { path: "writing", element: <Writing /> },
      { path: "dictionary", element: <DictionaryAdmin /> },

      // 🧠 EXAM TREE
      {
        path: "exams",
        children: [
          { index: true, element: <Exams /> }, // /exams
          {
            path: ":examId/sections",
            children: [
              { index: true, element: <Sections /> }, // /exams/:examId/sections
              {
                path: ":sectionId/questions",
                children: [
                  {
                    index: true,
                    element: <Questions />,
                  },
                  {
                    path: ":questionId/options",
                    element: <Options />,
                  },
                ],
              },
            ],
          },
        ],
      },

      // 📚 VOCABULARY
      {
        path: "decks",
        children: [
          {
            index: true,
            element: <Decks />, // /decks
          },
          {
            path: ":deckId/cards",
            element: <Cards />,
          },
        ],
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
