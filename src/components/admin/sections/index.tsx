import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Popconfirm, message } from "antd";
import {
  ProTable,
  type ProColumns,
  ActionType,
} from "@ant-design/pro-components";

import { getSectionsByExam, deleteSection } from "@/services/api";
import CreateSection from "./create.section";
import UpdateSection from "./update.section";

type Section = {
  id: string;
  examId: string;
  idx: number;
  title: string;
  instructionsMd?: string;
  audioUrl?: string;
  transcriptMd?: string;
};

export default function Sections() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType | undefined>(undefined);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  if (!examId) return null;

  const columns: ProColumns<Section>[] = [
    {
      title: "Order",
      dataIndex: "idx",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Actions",
      width: 280,
      render: (_, s) => (
        <>
          <Button
            size="small"
            onClick={() =>
              navigate(`/exams/${examId}/sections/${s.id}/questions`)
            }
          >
            Questions
          </Button>

          <Button
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setSelectedSection(s);
              setOpenUpdate(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete section?"
            description="This will delete all questions inside this section."
            onConfirm={async () => {
              await deleteSection(s.id);
              message.success("Deleted section");
              actionRef.current?.reload();
            }}
          >
            <Button danger size="small" style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<Section>
        rowKey="id"
        actionRef={actionRef}
        headerTitle={`Sections of Exam`}
        search={false}
        columns={columns}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpenCreate(true)}>
            Add Section
          </Button>,
        ]}
        request={async () => {
          const res = await getSectionsByExam(examId);

          return {
            data: res.data?.data || [],
            success: true,
          };
        }}
      />

      {/* CREATE */}
      <CreateSection
        open={openCreate}
        examId={examId}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => actionRef.current?.reload()}
      />

      {/* UPDATE */}
      {selectedSection && (
        <UpdateSection
          open={openUpdate}
          section={selectedSection}
          onClose={() => {
            setOpenUpdate(false);
            setSelectedSection(null);
          }}
          onSuccess={() => actionRef.current?.reload()}
        />
      )}
    </>
  );
}
