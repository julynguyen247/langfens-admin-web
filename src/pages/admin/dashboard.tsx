import { Card, Col, Row, Statistic } from "antd";
import {
  UserOutlined,
  ReadOutlined,
  BookOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

export default function DashboardPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Welcome 👋">
            <p>
              Đây là trang quản trị <b>Langfens Admin Panel</b>.
            </p>
            <p>Bạn có thể quản lý:</p>
            <ul className="list-disc ml-6">
              <li>Người dùng (Users)</li>
              <li>Đề thi (Exams)</li>
              <li>Speaking / Writing</li>
              <li>Vocabulary Decks & Cards</li>
              <li>Dictionary</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </>
  );
}
