import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateWritingExam } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: any | null) => void;
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

const UpdateWriting = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [form] = Form.useForm<FieldType>();
  const { message, notification } = App.useApp();

  // fill dữ liệu khi chọn 1 writing exam
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
      const res = await updateWritingExam(
        id,
        title,
        taskText,
        examType,
        level,
        tag
      );

      if (res) {
        message.success("Cập nhật đề Writing thành công");
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
        refreshTable();
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error: any) {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật đề Writing"
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
        name="update-writing-exam"
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
          label="Task / Đề bài (Markdown)"
          name="taskText"
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

export default UpdateWriting;
