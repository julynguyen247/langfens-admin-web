import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Popconfirm, Tag, message } from "antd";
import {
  ProTable,
  type ProColumns,
  ActionType,
} from "@ant-design/pro-components";

import { getQuestionsBySection, deleteQuestion } from "@/services/api";
import CreateQuestion from "./create.question";
import UpdateQuestion from "./update.question";

type Question = {
  id: string;
  sectionId: string;
  idx: number;
  type: string;
  difficulty: number;
  promptMd: string;
  skill: string;
};

export default function Questions() {
  const { examId, sectionId } = useParams<{
    examId: string;
    sectionId: string;
  }>();
  const actionRef = useRef<ActionType | undefined>(undefined);
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  if (!sectionId) return null;

  const columns: ProColumns<Question>[] = [
    {
      title: "#",
      dataIndex: "idx",
      width: 60,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 180,
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "Skill",
      dataIndex: "skill",
      width: 120,
      render: (v) => <Tag color="purple">{v}</Tag>,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      width: 100,
    },
    {
      title: "Prompt",
      dataIndex: "promptMd",
      ellipsis: true,
    },
    {
      title: "Actions",
      width: 280,
      render: (_, q) => (
        <>
          <Button
            size="small"
            onClick={() =>
              navigate(
                `/exams/${examId}/sections/${sectionId}/questions/${q.id}/options`
              )
            }
          >
            Options
          </Button>

          <Button
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setSelectedQuestion(q);
              setOpenUpdate(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete question?"
            description="This will delete all options of this question."
            onConfirm={async () => {
              await deleteQuestion(q.id);
              message.success("Deleted question");
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
      <ProTable<Question>
        rowKey="id"
        actionRef={actionRef}
        headerTitle={`Questions`}
        search={false}
        columns={columns}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpenCreate(true)}>
            Add Question
          </Button>,
        ]}
        request={async () => {
          const res = await getQuestionsBySection(sectionId);

          return {
            data: res.data?.data || [],
            success: true,
          };
        }}
      />

      {/* CREATE */}
      <CreateQuestion
        open={openCreate}
        sectionId={sectionId}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => actionRef.current?.reload()}
      />

      {/* UPDATE */}
      {selectedQuestion && (
        <UpdateQuestion
          open={openUpdate}
          question={selectedQuestion}
          onClose={() => {
            setOpenUpdate(false);
            setSelectedQuestion(null);
          }}
          onSuccess={() => actionRef.current?.reload()}
        />
      )}
    </>
  );
}
