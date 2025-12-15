import { Modal, Form, Input, InputNumber, App } from "antd";
import { addSection } from "@/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  examId: string;
  onSuccess: () => void;
};

export default function CreateSection({
  open,
  onClose,
  examId,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    await addSection(
      examId,
      values.idx,
      values.title,
      values.instructionsMd,
      values.audioUrl || "",
      values.transcriptMd || ""
    );

    message.success("Created section");
    form.resetFields();
    onSuccess();
    onClose();
  };

  return (
    <Modal
      title="Create Section"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="idx" label="Order (idx)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="instructionsMd" label="Instructions (Markdown)">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="audioUrl" label="Audio URL">
          <Input />
        </Form.Item>

        <Form.Item name="transcriptMd" label="Transcript">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
