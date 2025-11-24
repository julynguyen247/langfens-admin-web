import { useState } from "react";
import { App, Divider, Form, Input, Modal, Select, InputNumber } from "antd";
import type { FormProps } from "antd";
import { addExam } from "@/services/api";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  title: string;
  slug: string;
  descriptionMd: string;
  category: string;
  level: string;
  durationMin: number;
};

const CreateExamModal = (props: IProps) => {
  const { open, setOpen, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    try {
      const res = await addExam(
        values.title,
        values.slug,
        values.descriptionMd,
        values.category,
        values.level,
        values.durationMin
      );

      if (res) {
        message.success("Tạo Exam thành công!");
        form.resetFields();
        setOpen(false);
        refreshTable();
      } else {
        notification.error({
          message: "Tạo thất bại",
          description: "Không nhận được phản hồi hợp lệ",
        });
      }
    } catch (err) {
      notification.error({
        message: "Tạo không thành công",
        description: "Lỗi khi gửi dữ liệu",
      });
    }

    setIsSubmit(false);
  };

  return (
    <Modal
      title="Tạo Exam mới"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={600}
    >
      <Divider />
      <Form
        form={form}
        name="create-exam"
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
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mô tả (Markdown)"
          name="descriptionMd"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Category"
          name="category"
          rules={[{ required: true, message: "Vui lòng chọn category" }]}
        >
          <Select
            placeholder="Chọn category"
            options={[
              { label: "reading", value: "reading" },
              { label: "listening", value: "listening" },
              { label: "writing", value: "writing" },
              { label: "speaking", value: "speaking" },
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
              { label: "easy", value: "easy" },
              { label: "medium", value: "medium" },
              { label: "hard", value: "hard" },
            ]}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Duration (phút)"
          name="durationMin"
          rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateExamModal;
