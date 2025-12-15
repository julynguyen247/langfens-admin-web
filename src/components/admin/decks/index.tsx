import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, Tag, message } from "antd";
import {
  ProTable,
  type ProColumns,
  ActionType,
} from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";

import { getDecks, deleteDeck } from "@/services/api";
import CreateDeck from "./create.deck";
import UpdateDeck from "./update.deck";

type Deck = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
};

export default function DecksPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const columns: ProColumns<Deck>[] = [
    { valueType: "indexBorder", width: 48 },

    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      copyable: true,
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, r) => (
        <Tag color={r.status === "PUBLISHED" ? "green" : "orange"}>
          {r.status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      width: 260,
      render: (_, d) => (
        <>
          <Button size="small" onClick={() => navigate(`/decks/${d.id}/cards`)}>
            Cards
          </Button>

          <Button
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setSelectedDeck(d);
              setOpenUpdate(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete deck?"
            onConfirm={async () => {
              await deleteDeck(d.id);
              message.success("Deleted deck");
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
      <ProTable<Deck>
        rowKey="id"
        actionRef={actionRef}
        headerTitle="Deck Management"
        columns={columns}
        search={false}
        toolBarRender={() => [
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenCreate(true)}
          >
            Add Deck
          </Button>,
        ]}
        request={async () => {
          const data = await getDecks({
            page: 1,
            pageSize: 100,
          });

          return {
            data, // ✅ API trả ARRAY
            success: true,
            total: data.length,
          };
        }}
      />

      {/* CREATE */}
      <CreateDeck
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => actionRef.current?.reload()}
      />

      {/* UPDATE */}
      <UpdateDeck
        open={openUpdate}
        deck={selectedDeck}
        onClose={() => {
          setOpenUpdate(false);
          setSelectedDeck(null);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />
    </>
  );
}
