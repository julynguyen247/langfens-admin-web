import { useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { createWritingExam } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTable: () => void;
}

type FieldType = {
  title: string;
  promptMd: string;
  examType: number;
  level: string;
  tag: string;
};

const CreateWriting = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm<FieldType>();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      // ✅ Gọi API theo dạng payload object
      const res = await createWritingExam(
        values.title,
        values.promptMd,
        values.examType,
        values.level,
        values.tag
      );

      if (res) {
        message.success("Tạo đề Writing thành công!");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Tạo thất bại",
          description: "Không nhận được phản hồi hợp lệ",
        });
      }
    } catch (error) {
      notification.error({
        message: "Tạo thất bại",
        description: "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm đề Writing mới"
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
        name="create-writing-exam"
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
          label="Prompt / Đề bài (Markdown)"
          name="promptMd"
          rules={[{ required: true, message: "Vui lòng nhập đề bài" }]}
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
            options={[
              { label: "Task 1", value: 1 },
              { label: "Task 2", value: 2 },
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
          <Input placeholder="Ví dụ: IELTS, TOEIC, Task 1, Essay, ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateWriting;
