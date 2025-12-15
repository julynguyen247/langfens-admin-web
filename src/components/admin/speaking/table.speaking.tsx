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

import { getSpeakingExams, deleteSpeakingExam } from "@/services/api";
import CreateSpeaking from "./create.speaking";
import UpdateSpeaking from "./update.speaking";

type SpeakingExam = {
  id: string;
  title: string;
  taskText: string;
  examType: number;
  level: string;
  tag: string;
  createdAt?: string;
};

const TableSpeaking = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<SpeakingExam | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDelete = async (id: string) => {
    setIsDelete(true);
    try {
      const res = await deleteSpeakingExam(id);
      if (res) {
        message.success("Xóa đề Speaking thành công");
        refreshTable();
      } else {
        notification.error({ message: "Đã có lỗi xảy ra khi xóa" });
      }
    } catch {
      notification.error({ message: "Đã có lỗi xảy ra khi xóa" });
    }
    setIsDelete(false);
  };

  const columns: ProColumns<SpeakingExam>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Exam type",
      dataIndex: "examType",
      render: (_, entity) => {
        const map: Record<number, string> = {
          1: "Part 1",
          2: "Part 2",
          3: "Part 3",
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      hideInSearch: true,
      render: (_, entity) =>
        entity.createdAt
          ? new Date(entity.createdAt).toLocaleString("vi-VN")
          : "-",
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
            title="Xác nhận xóa đề Speaking"
            description="Bạn có chắc chắn muốn xóa đề này?"
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
      <ProTable<SpeakingExam>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={false}
        request={async () => {
          try {
            const res = await getSpeakingExams();
            const list: SpeakingExam[] = res.data.data || [];

            const filtered = searchKeyword.trim()
              ? list.filter((item) =>
                  item.title.toLowerCase().includes(searchKeyword.toLowerCase())
                )
              : list;

            return {
              data: filtered,
              success: true,
              total: filtered.length,
            };
          } catch {
            return { data: [], success: false };
          }
        }}
        headerTitle="Danh sách đề Speaking"
        toolBarRender={() => [
          <Space key="search" style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Tìm theo tiêu đề..."
              onSearch={() => refreshTable()}
              allowClear
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ width: 260 }}
            />
          </Space>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalCreate(true);
            }}
          >
            Thêm mới
          </Button>,
        ]}
      />

      <CreateSpeaking
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateSpeaking
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableSpeaking;
