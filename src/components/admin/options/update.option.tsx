import { Modal, Form, Input, InputNumber, Switch, App } from "antd";
import { updateOption } from "@/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  option: any | null;
  onSuccess: () => void;
};

export default function UpdateOption({
  open,
  onClose,
  option,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    await updateOption(
      option.id,
      option.questionId,
      values.idx,
      values.contentMd,
      values.isCorrect
    );

    message.success("Updated option");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      title="Update Option"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Update"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={option ?? {}}
      >
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
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
