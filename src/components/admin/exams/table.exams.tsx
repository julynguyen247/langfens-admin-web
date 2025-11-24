import { deleteExam, getAllAdminExams } from "@/services/api";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm, Tag } from "antd";
import { useRef, useState } from "react";
import CreateExamModal from "./create.exams";
import UpdateExamModal from "./update.exams";

const TableExams = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<any | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDelete = async (id: string) => {
    setIsDelete(true);
    try {
      const res = await deleteExam(id);
      if (res) {
        message.success("Xóa exam thành công");
        refreshTable();
      }
    } catch {
      notification.error({ message: "Xóa exam thất bại" });
    }
    setIsDelete(false);
  };

  const columns: ProColumns<any>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Tên Exam",
      dataIndex: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (_, record) => <Tag color="blue">{record.category}</Tag>,
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (_, record) => <Tag color="gold">{record.level}</Tag>,
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "durationMin",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) =>
        record.status === "PUBLISHED" ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="red">Draft</Tag>
        ),
    },
    {
      title: "Thao tác",
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
            title="Xác nhận xóa exam"
            description="Bạn có chắc chắn muốn xóa exam này?"
            onConfirm={() => handleDelete(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDelete }}
          >
            <span style={{ cursor: "pointer" }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={false}
        request={async () => {
          try {
            const res = await getAllAdminExams();
            const list = res.data?.data || [];

            return {
              data: list,
              success: true,
              total: list.length,
            };
          } catch (err) {
            return { data: [], success: false };
          }
        }}
        headerTitle="Danh sách Exam"
        toolBarRender={() => [
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

      <CreateExamModal
        open={openModalCreate}
        setOpen={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateExamModal
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        data={dataUpdate}
        setData={setDataUpdate}
        refreshTable={refreshTable}
      />
    </>
  );
};

export default TableExams;
