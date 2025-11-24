import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateSpeakingExam } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: any | null) => void; // có thể define type SpeakingExam riêng
  dataUpdate: any | null;
}

type FieldType = {
  id: string;
  title: string;
  taskText: string;
  examType: number;
  level: string;
  tag: string;
};

const UpdateSpeaking = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm<FieldType>();

  // Fill form khi chọn 1 speaking exam để edit
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        title: dataUpdate.title,
        taskText: dataUpdate.taskText ?? "",
        examType: dataUpdate.examType,
        level: dataUpdate.level,
        tag: dataUpdate.tag ?? "",
      });
    }
  }, [dataUpdate, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, title, taskText, examType, level, tag } = values;

    setIsSubmit(true);
    try {
      const res = await updateSpeakingExam(
        id,
        title,
        taskText,
        examType,
        level,
        tag
      );

      if (res) {
        message.success("Cập nhật đề Speaking thành công");
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
        refreshTable();
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: "Không nhận được phản hồi hợp lệ",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Cập nhật thất bại",
        description: err?.message || "Lỗi trong quá trình gửi dữ liệu",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật đề Speaking"
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={600}
    >
      <Divider />
      <Form<FieldType>
        form={form}
        name="update-speaking-exam"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Nội dung task"
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

export default UpdateSpeaking;
