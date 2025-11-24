import { useEffect, useState } from "react";
import { App, Divider, Form, Input, InputNumber, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateExam } from "@/services/api";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
  setData: (v: any | null) => void;
  data: any | null; // exam được chọn
}

type FieldType = {
  id: string;
  title: string;
  slug: string;
  descriptionMd: string;
  category: string;
  level: string;
  durationMin: number;
  status: string;
};

const UpdateExamModal = (props: IProps) => {
  const { open, setOpen, refreshTable, setData, data } = props;

  const [form] = Form.useForm<FieldType>();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  // Khi chọn 1 exam để edit → fill form
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        id: data.id,
        title: data.title,
        slug: data.slug,
        descriptionMd: data.descriptionMd ?? "",
        category: data.category,
        level: data.level,
        durationMin: data.durationMin,
        status: data.status ?? "PUBLISHED",
      });
    }
  }, [data, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, title, descriptionMd, category, level, durationMin, status } =
      values;

    setIsSubmit(true);
    try {
      const res = await updateExam(
        id,
        title,
        descriptionMd,
        category,
        level,
        durationMin,
        status
      );

      if (res) {
        message.success("Cập nhật exam thành công");
        form.resetFields();
        setOpen(false);
        setData(null);
        refreshTable();
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ");
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
      title="Cập nhật Exam"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        setData(null);
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
        name="update-exam"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        {/* hidden id */}
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên Exam"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Slug" name="slug">
          <Input disabled />
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
          label="Thời lượng (phút)"
          name="durationMin"
          rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            placeholder="Chọn trạng thái"
            options={[
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateExamModal;
