import React, { useState } from "react";
import type { FormProps } from "antd";
import { App, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { login, getMe } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password } = values;
    setIsSubmit(true);

    try {
      const res = await login(email, password);

      const accessToken = res?.data?.data;
      if (!accessToken) {
        message.error("Sai email hoặc mật khẩu!");
        return;
      }

      localStorage.setItem("access_token", accessToken);

      // 2️⃣ Get me
      const meRes = await getMe();
      const account = meRes.data?.data; // ⚠️ lấy đúng data

      if (!account) {
        throw new Error("Không lấy được thông tin người dùng");
      }

      // 3️⃣ Check role ADMIN
      const isAdmin = account.roles?.includes("ADMIN");

      if (!isAdmin) {
        message.error("Tài khoản không có quyền quản trị!");
        localStorage.removeItem("access_token");
        return;
      }

      // 4️⃣ Set global state
      setIsAuthenticated(true);
      setUser(account);
      localStorage.setItem("user", JSON.stringify(account));

      message.success("Đăng nhập admin thành công!");
      navigate("/");
    } catch (err) {
      message.error("Đăng nhập thất bại!");
      localStorage.removeItem("access_token");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="bg-gray-200 rounded-2xl p-12 w-[30vw] min-w-[360px]">
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isSubmit} block>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
