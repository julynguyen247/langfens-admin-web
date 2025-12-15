import { Modal, Form, Input, InputNumber, App } from "antd";
import { updateDeckCard } from "@/services/api";

type Props = {
  open: boolean;
  card: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function UpdateCard({ open, card, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    await updateDeckCard(card.id, values);
    message.success("Updated card");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Update Card"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Update"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={card}
        onFinish={onFinish}
      >
        <Form.Item name="idx" label="Index" rules={[{ required: true }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item name="frontMd" label="Front" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="backMd" label="Back" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="hintMd" label="Hint">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
