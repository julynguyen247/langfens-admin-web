import React, { useEffect } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  ReadOutlined,
  BookOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space, message } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useCurrentApp } from "../context/app.context";

const AdminLayout: React.FC = () => {
  const { Header, Sider, Content } = Layout;
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, isAuthenticated, setIsAuthenticated } = useCurrentApp();

  // 🔐 Logout
  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    message.success("Đã đăng xuất thành công!");
    navigate("/login");
  };

  // 🔒 Protect admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục!");
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const userMenu = {
    items: [
      {
        key: "logout",
        label: (
          <div onClick={handleLogout} className="flex items-center gap-2">
            <LogoutOutlined />
            Đăng xuất
          </div>
        ),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ========== SIDEBAR ========== */}
      <Sider collapsible>
        <div className="text-white text-xl font-bold text-center my-6">
          Langfens Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/",
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "/users",
              icon: <UserOutlined />,
              label: <Link to="/users">Users</Link>,
            },
            {
              key: "/exams",
              icon: <ReadOutlined />,
              label: <Link to="/exams">Exams</Link>,
            },
            {
              key: "/speaking",
              icon: <ReadOutlined />,
              label: <Link to="/speaking">Speaking</Link>,
            },
            {
              key: "/writing",
              icon: <ReadOutlined />,
              label: <Link to="/writing">Writing</Link>,
            },
            {
              key: "/decks",
              icon: <BookOutlined />,
              label: <Link to="/decks">Vocabulary Decks</Link>,
            },
            {
              key: "/dictionary",
              icon: <DatabaseOutlined />,
              label: <Link to="/dictionary">Dictionary</Link>,
            },
          ]}
        />
      </Sider>

      {/* ========== MAIN ========== */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 64,
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <div className="text-lg font-semibold text-gray-800">
            Admin Management
          </div>

          {!isLoading && isAuthenticated && (
            <Dropdown menu={userMenu}>
              <Space className="cursor-pointer">
                <FaUserCircle size={22} />
                <span className="text-gray-700 font-medium">Admin</span>
              </Space>
            </Dropdown>
          )}
        </Header>

        <Content style={{ margin: 16 }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
