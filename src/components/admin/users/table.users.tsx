import { useRef } from "react";
import { Tag } from "antd";
import {
  ProTable,
  type ProColumns,
  ActionType,
} from "@ant-design/pro-components";

import { getAllUsers } from "@/services/api";

type IUserTable = {
  id: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
};

const UsersPage = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "id",
      ellipsis: true,
      copyable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Email confirmed",
      dataIndex: "emailConfirmed",
      width: 160,
      render: (_, record) =>
        record.emailConfirmed ? (
          <Tag color="green">CONFIRMED</Tag>
        ) : (
          <Tag color="red">NOT CONFIRMED</Tag>
        ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      render: (_, record) => (
        <>
          {record.roles?.map((r) => (
            <Tag key={r} color={r === "ADMIN" ? "red" : "blue"}>
              {r}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <ProTable<IUserTable>
      rowKey="id"
      actionRef={actionRef}
      headerTitle="Danh sách người dùng"
      cardBordered
      search={false}
      columns={columns}
      request={async () => {
        const res = await getAllUsers();

        const list = res.data.data || []; // 👈 CHỐT DÒNG NÀY

        const data: IUserTable[] = list.map((u: any) => ({
          id: u.id,
          email: u.email,
          emailConfirmed: u.emailConfirmed,
          roles: u.roles || [],
        }));

        return {
          data,
          success: true,
          total: data.length,
        };
      }}
    />
  );
};

export default UsersPage;
