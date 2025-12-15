import { Modal, Form, Input, Select, App } from "antd";
import { createDeck } from "@/services/api";

export default function CreateDeck({ open, onClose, onSuccess }: any) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (v: any) => {
    await createDeck({
      ...v,
      userId: JSON.parse(localStorage.getItem("user")!).id,
    });
    message.success("Created deck");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      title="Create Deck"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status" initialValue="draft">
          <Select options={[{ value: "draft" }, { value: "published" }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
