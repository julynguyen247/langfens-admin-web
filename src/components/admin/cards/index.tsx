import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, App } from "antd";
import { PlusOutlined, DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import { getDeckCards, deleteDeckCard } from "@/services/api";
import CreateCard from "./create.card";
import UpdateCard from "./update.card";

export default function CardsPage() {
  const { deckId } = useParams<{ deckId: string }>(); // ✅ lấy từ URL
  const actionRef = useRef<ActionType | undefined>(undefined);
  const { message } = App.useApp();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  if (!deckId) return null; // an toàn

  const columns: ProColumns<any>[] = [
    {
      title: "Index",
      dataIndex: "idx",
      width: 80,
    },
    {
      title: "Front",
      dataIndex: "frontMd",
      ellipsis: true,
    },
    {
      title: "Back",
      dataIndex: "backMd",
      ellipsis: true,
    },
    {
      title: "Hint",
      dataIndex: "hintMd",
      ellipsis: true,
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => (
        <>
          <EditTwoTone
            style={{ marginRight: 12, cursor: "pointer" }}
            onClick={() => {
              setSelectedCard(record);
              setOpenUpdate(true);
            }}
          />

          <Popconfirm
            title="Delete this card?"
            onConfirm={async () => {
              await deleteDeckCard(record.id);
              message.success("Deleted card");
              actionRef.current?.reload();
            }}
          >
            <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<any>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async () => {
          const res = await getDeckCards(deckId);
          return {
            data: res.data || [],
            success: true,
          };
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
          >
            Add card
          </Button>,
        ]}
      />

      <CreateCard
        open={openCreate}
        deckId={deckId}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => actionRef.current?.reload()}
      />

      {selectedCard && (
        <UpdateCard
          open={openUpdate}
          card={selectedCard}
          onClose={() => setOpenUpdate(false)}
          onSuccess={() => actionRef.current?.reload()}
        />
      )}
    </>
  );
}
