import { Modal, Form, Input, InputNumber, Select, App } from "antd";
import { addQuestion } from "@/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  sectionId: string;
  onSuccess: () => void;
};

const QUESTION_TYPES = [
  { label: "MCQ (Single)", value: "MULTIPLE_CHOICE_SINGLE" },
  { label: "True / False / Not Given", value: "TRUE_FALSE_NOT_GIVEN" },
];

export default function CreateQuestion({
  open,
  onClose,
  sectionId,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    await addQuestion(
      sectionId,
      values.idx,
      values.type,
      "reading",
      values.difficulty,
      values.promptMd,
      values.explanationMd || "",
      {}, // blankAcceptTexts
      {}, // blankAcceptRegex
      {}, // matchPairs
      [], // orderCorrects
      [], // shortAnswerAcceptTexts
      [] // shortAnswerAcceptRegex
    );

    message.success("Created question");
    form.resetFields();
    onSuccess();
    onClose();
  };

  return (
    <Modal
      title="Create Question"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="idx" label="Order (idx)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Question Type"
          rules={[{ required: true }]}
        >
          <Select options={QUESTION_TYPES} />
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="Difficulty"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="promptMd"
          label="Prompt (Markdown)"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="explanationMd" label="Explanation (optional)">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
