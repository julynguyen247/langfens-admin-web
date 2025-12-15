import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Popconfirm, Tag, message } from "antd";
import {
  ProTable,
  type ProColumns,
  ActionType,
} from "@ant-design/pro-components";

import { getOptionsByQuestion, deleteOption } from "@/services/api";
import CreateOption from "./create.option";
import UpdateOption from "./update.option";

type Option = {
  id: string;
  questionId: string;
  idx: number;
  contentMd: string;
  isCorrect: boolean;
};

export default function Options() {
  const { questionId } = useParams<{ questionId: string }>();
  const actionRef = useRef<ActionType | undefined>(undefined);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  if (!questionId) return null;

  const columns: ProColumns<Option>[] = [
    {
      title: "#",
      dataIndex: "idx",
      width: 60,
    },
    {
      title: "Content",
      dataIndex: "contentMd",
      ellipsis: true,
    },
    {
      title: "Correct",
      dataIndex: "isCorrect",
      width: 120,
      render: (v) =>
        v ? <Tag color="green">TRUE</Tag> : <Tag color="red">FALSE</Tag>,
    },
    {
      title: "Actions",
      width: 220,
      render: (_, o) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setSelectedOption(o);
              setOpenUpdate(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete option?"
            onConfirm={async () => {
              await deleteOption(o.id);
              message.success("Deleted option");
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
      <ProTable<Option>
        rowKey="id"
        actionRef={actionRef}
        headerTitle="Options"
        search={false}
        columns={columns}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpenCreate(true)}>
            Add Option
          </Button>,
        ]}
        request={async () => {
          const res = await getOptionsByQuestion(questionId);

          return {
            data: res.data?.data || [],
            success: true,
          };
        }}
      />

      {/* CREATE */}
      <CreateOption
        open={openCreate}
        questionId={questionId}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => actionRef.current?.reload()}
      />

      {/* UPDATE */}
      {selectedOption && (
        <UpdateOption
          open={openUpdate}
          option={selectedOption}
          onClose={() => {
            setOpenUpdate(false);
            setSelectedOption(null);
          }}
          onSuccess={() => actionRef.current?.reload()}
        />
      )}
    </>
  );
}
