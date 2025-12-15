import { Modal, Form, Input, InputNumber, Switch, App } from "antd";
import { addOption } from "@/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  questionId: string;
  onSuccess: () => void;
};

export default function CreateOption({
  open,
  onClose,
  questionId,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    await addOption(questionId, values.idx, values.contentMd, values.isCorrect);

    message.success("Created option");
    form.resetFields();
    onSuccess();
    onClose();
  };

  return (
    <Modal
      title="Create Option"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="idx" label="Order (idx)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="contentMd"
          label="Content (Markdown)"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="isCorrect"
          label="Correct answer?"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
