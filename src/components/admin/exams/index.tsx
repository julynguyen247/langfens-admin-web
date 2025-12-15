import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import {
  ActionType,
  ProTable,
  type ProColumns,
} from "@ant-design/pro-components";
import { Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllAdminExams, deleteExam } from "@/services/api";
import { useRef, useState } from "react";

type Exam = {
  id: string;
  title: string;
  category: string;
  level: string;
  durationMin: number;
  status: string;
};

export default function ExamListPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const navigate = useNavigate();

  const columns: ProColumns<Exam>[] = [
    { valueType: "indexBorder", width: 48 },
    { title: "Title", dataIndex: "title" },
    { title: "Category", dataIndex: "category" },
    { title: "Level", dataIndex: "level" },
    {
      title: "Duration",
      dataIndex: "durationMin",
      render: (_, e) => `${e.durationMin} min`,
    },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: (_, e) => (
        <>
          <Button
            size="small"
            onClick={() => navigate(`/exams/${e.id}/sections`)}
          >
            Sections
          </Button>
          <EditTwoTone style={{ marginLeft: 12 }} />
          <Popconfirm
            title="Delete exam?"
            onConfirm={async () => {
              await deleteExam(e.id);
              message.success("Deleted");
              actionRef.current?.reload();
            }}
          >
            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ marginLeft: 12 }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <ProTable
      rowKey="id"
      actionRef={actionRef}
      headerTitle="Exam Management"
      columns={columns}
      search={false}
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />}>
          Add Exam
        </Button>,
      ]}
      request={async () => {
        const res = await getAllAdminExams();
        return { data: res.data.data, success: true };
      }}
    />
  );
}
