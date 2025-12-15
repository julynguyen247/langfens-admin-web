import { Modal, Form, Input, InputNumber, App } from "antd";
import { createDeckCard } from "@/services/api";

type Props = {
  open: boolean;
  deckId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateCard({
  open,
  deckId,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    await createDeckCard(deckId, values);
    message.success("Created card");
    onSuccess();
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Create Card"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="idx"
          label="Index"
          rules={[{ required: true, message: "Enter index" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          name="frontMd"
          label="Front"
          rules={[{ required: true, message: "Enter front content" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="backMd"
          label="Back"
          rules={[{ required: true, message: "Enter back content" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="hintMd" label="Hint (optional)">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
