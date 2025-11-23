import { deleteUserAPI, getAllUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, message, notification, Popconfirm } from "antd";
import { useRef, useState } from "react";
import CreateUser from "./create.user";
import UpdateUser from "./update.user";

type TSearch = {
  displayName: string;
  email: string;
  createdAtRange: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);

  const handleDeleteUser = async (id: string) => {
    setIsDeleteUser(true);
    const res = await deleteUserAPI(id);
    if (res) {
      message.success("Xóa user thành công");
      refreshTable();
    } else {
      notification.error({ message: "Đã có lỗi xảy ra" });
    }
    setIsDeleteUser(false);
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
      fieldProps: {
        placeholder: ["Start date", "End date"],
      },
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa user"}
            description={"Bạn có chắc chắn muốn xóa user này ?"}
            onConfirm={() => handleDeleteUser(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteUser }}
          >
            <span style={{ cursor: "pointer", marginLeft: 20 }}>
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer" }}
              />
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const queryParams: any = {
            page: params.current,
            limit: params.pageSize,
          };

          if (params.email) {
            queryParams.email = `/${params.email}/i`;
          }
          if (params.displayName) {
            queryParams.fullName = `/${params.displayName}/i`;
          }
          const createDateRange = dateRangeValidate(params.createdAtRange);
          if (createDateRange) {
            queryParams["createdAt>="] = createDateRange[0];
            queryParams["createdAt<="] = createDateRange[1];
          }

          queryParams.sort =
            sort?.createdAt === "ascend" ? "createdAt" : "-createdAt";

          const res = await getAllUsersAPI(queryParams);
          return {
            data: res.items,
            success: true,
            total: res.meta.totalItems,
          };
        }}
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              console.log("Import user data");
            }}
          >
            Import
          </Button>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalCreate(true);
            }}
          >
            Add new
          </Button>,
        ]}
      />
      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateUser
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableUser;
