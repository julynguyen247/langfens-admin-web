import { useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { createWritingExam } from "@/services/api";

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

const CreateWriting = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm<FieldType>();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const res = await createWritingExam(
        values.title,
        values.taskText,
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
    } catch {
      notification.error({
        message: "Tạo thất bại",
        description: "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm mới đề Writing"
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
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Đề bài Writing"
          name="taskText"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Loại đề" name="examType" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Task 1", value: 1 },
              { label: "Task 2", value: 2 },
            ]}
          />
        </Form.Item>

        <Form.Item label="Level" name="level" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Tag" name="tag" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateWriting;
