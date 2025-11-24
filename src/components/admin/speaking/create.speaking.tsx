import { useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { createSpeakingExam } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  title: string;
  taskText: string;
  examType: number;
  level: string;
  tag: string;
};

const CreateSpeaking = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm<FieldType>();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const res = await createSpeakingExam(
        values.title,
        values.taskText,
        values.examType,
        values.level,
        values.tag
      );

      if (res) {
        message.success("Tạo đề Speaking thành công!");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Tạo thất bại",
          description: "Không nhận được phản hồi hợp lệ",
        });
      }
    } catch (err) {
      notification.error({
        message: "Tạo thất bại",
        description: "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm mới đề Speaking"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={600}
    >
      <Divider />
      <Form<FieldType>
        form={form}
        name="create-speaking-exam"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Nội dung câu hỏi / Task"
          name="taskText"
          rules={[{ required: true, message: "Vui lòng nhập taskText" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Loại đề (examType)"
          name="examType"
          rules={[{ required: true, message: "Vui lòng chọn loại đề" }]}
        >
          <Select
            placeholder="Chọn loại đề"
            // chỉnh options cho đúng với backend của bạn
            options={[
              { label: "Part 1", value: 1 },
              { label: "Part 2", value: 2 },
              { label: "Part 3", value: 3 },
            ]}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Level"
          name="level"
          rules={[{ required: true, message: "Vui lòng chọn level" }]}
        >
          <Select
            placeholder="Chọn level"
            options={[
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ]}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Vui lòng nhập tag" }]}
        >
          <Input placeholder="Ví dụ: IELTS, TOEIC, Part 1, ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSpeaking;
