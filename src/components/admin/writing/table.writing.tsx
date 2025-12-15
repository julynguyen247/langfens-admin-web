import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import {
  Button,
  message,
  notification,
  Popconfirm,
  Input,
  Space,
  Tag,
} from "antd";
import { useRef, useState } from "react";

import { getWritingExams, deleteWritingExam } from "@/services/api";
import CreateWriting from "./create.writing";
import UpdateWriting from "./update.writing";

type WritingExam = {
  id: string;
  title: string;
  taskText: string;
  examType: number;
  level: string;
  tag: string;
  createdAt?: string;
};

const TableWriting = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<WritingExam | null>(null);
  const [isDelete, setIsDelete] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const refreshTable = () => actionRef.current?.reload();

  const handleDelete = async (id: string) => {
    setIsDelete(true);
    try {
      await deleteWritingExam(id);
      message.success("Xóa đề Writing thành công");
      refreshTable();
    } catch {
      notification.error({ message: "Xóa thất bại" });
    }
    setIsDelete(false);
  };

  const columns: ProColumns<WritingExam>[] = [
    { valueType: "indexBorder", width: 48 },
    { title: "Tiêu đề", dataIndex: "title" },
    {
      title: "Task",
      dataIndex: "examType",
      render: (_, e) => (e.examType === 1 ? "Task 1" : "Task 2"),
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (_, e) => <Tag color="gold">{e.level}</Tag>,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      render: (_, e) => <Tag color="blue">{e.tag}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (_, e) =>
        e.createdAt ? new Date(e.createdAt).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      render: (_, e) => (
        <>
          <EditTwoTone
            style={{ marginRight: 12 }}
            onClick={() => {
              setDataUpdate(e);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            title="Xóa đề Writing?"
            onConfirm={() => handleDelete(e.id)}
          >
            <DeleteTwoTone twoToneColor="#ff4d4f" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        headerTitle="Danh sách đề Writing"
        toolBarRender={() => [
          <Input.Search
            key="search"
            placeholder="Tìm theo tiêu đề"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={refreshTable}
            style={{ width: 260 }}
          />,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
          </Button>,
        ]}
        request={async () => {
          const res = await getWritingExams();
          const list = res.data.data || [];
          const filtered = searchKeyword
            ? list.filter((i: any) =>
                i.title.toLowerCase().includes(searchKeyword.toLowerCase())
              )
            : list;
          return { data: filtered, success: true };
        }}
      />

      <CreateWriting
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateWriting
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableWriting;
