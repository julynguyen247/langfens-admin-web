import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";

import { getWritingExams, deleteWritingExam } from "@/services/api";

import CreateWriting from "./create.writing";
import UpdateWriting from "./update.writing";

export interface IWritingExam {
  id: string;
  title: string;
  taskText: string;
  examType: number;
  level: string;
  tag: string;
  createdAt?: string;
}

const TableWriting = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IWritingExam | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteWriting = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await deleteWritingExam(id);
      if (res) {
        message.success("Xóa đề Writing thành công");
        refreshTable();
      }
    } catch {
      notification.error({ message: "Đã có lỗi xảy ra khi xóa đề Writing" });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ProColumns<IWritingExam>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Task / Đề bài",
      dataIndex: "taskText",
      render: (_, entity) =>
        entity.taskText?.length > 80
          ? entity.taskText.slice(0, 80) + "..."
          : entity.taskText,
      ellipsis: true,
    },
    {
      title: "Exam type",
      dataIndex: "examType",
      render: (_, entity) => {
        const map: Record<number, string> = {
          1: "Task 1",
          2: "Task 2",
        };
        return map[entity.examType] ?? entity.examType;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (_, entity) => <Tag color="gold">{entity.level}</Tag>,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      render: (_, entity) =>
        entity.tag ? <Tag color="blue">{entity.tag}</Tag> : "-",
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
            title="Xác nhận xóa đề Writing"
            description="Bạn có chắc chắn muốn xóa đề này?"
            onConfirm={() => handleDeleteWriting(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleting }}
          >
            <span style={{ cursor: "pointer", marginLeft: 20 }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IWritingExam>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        search={false}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        request={async () => {
          try {
            const res = await getWritingExams();
            // tùy response của BE: { isSuccess, data } hoặc mảng luôn
            const list: IWritingExam[] = res.data?.data || res.data || [];
            return {
              data: list,
              success: true,
              total: list.length,
            };
          } catch {
            return { data: [], success: false };
          }
        }}
        headerTitle="Danh sách đề Writing"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => console.log("Import writing data")}
          >
            Import
          </Button>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Add new
          </Button>,
        ]}
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
