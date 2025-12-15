import { useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Divider,
  App,
  Alert,
} from "antd";
import { importDictionary, reindexDictionary } from "@/services/api";

export default function DictionaryAdmin() {
  const { message } = App.useApp();

  const [importLoading, setImportLoading] = useState(false);
  const [reindexLoading, setReindexLoading] = useState(false);

  // =====================
  // IMPORT HANDLER
  // =====================
  const onImport = async (values: any) => {
    setImportLoading(true);
    try {
      await importDictionary(values.path, values.maxLines ?? 0);
      message.success("Import dictionary thành công");
    } catch (err) {
      message.error("Import dictionary thất bại");
    } finally {
      setImportLoading(false);
    }
  };

  // =====================
  // REINDEX HANDLER
  // =====================
  const onReindex = async (values: any) => {
    setReindexLoading(true);
    try {
      await reindexDictionary(values.batchSize);
      message.success("Reindex dictionary thành công");
    } catch (err) {
      message.error("Reindex dictionary thất bại");
    } finally {
      setReindexLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* ================= IMPORT CARD ================= */}
      <Card title="📥 Import Dictionary">
        <Alert
          type="info"
          showIcon
          message="Import từ file JSON hoặc TXT trên server"
          description="Path là đường dẫn file trên server (VD: /data/dictionary/data.json)"
          style={{ marginBottom: 16 }}
        />

        <Form layout="vertical" onFinish={onImport}>
          <Form.Item
            name="path"
            label="File path"
            rules={[{ required: true, message: "Vui lòng nhập path file" }]}
          >
            <Input placeholder="/data/dictionary/dict.json" />
          </Form.Item>

          <Form.Item name="maxLines" label="Max lines (optional)">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="0 = import toàn bộ"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={importLoading}>
            Import
          </Button>
        </Form>
      </Card>

      <Divider />

      {/* ================= REINDEX CARD ================= */}
      <Card title="🔄 Reindex Dictionary">
        <Alert
          type="warning"
          showIcon
          message="Cảnh báo"
          description="Reindex là tác vụ nặng, có thể mất nhiều thời gian"
          style={{ marginBottom: 16 }}
        />

        <Form layout="vertical" onFinish={onReindex}>
          <Form.Item name="batchSize" label="Batch size (optional)">
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="VD: 1000"
            />
          </Form.Item>

          <Button
            danger
            type="primary"
            htmlType="submit"
            loading={reindexLoading}
          >
            Reindex
          </Button>
        </Form>
      </Card>
    </Space>
  );
}
