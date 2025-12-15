import { Modal, Form, Input, Select, App } from "antd";
import { updateDeck } from "@/services/api";

export default function UpdateDeck({ open, onClose, deck, onSuccess }: any) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (v: any) => {
    await updateDeck(deck.id, v);
    message.success("Updated deck");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      title="Update Deck"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={deck}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={[{ value: "draft" }, { value: "published" }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
