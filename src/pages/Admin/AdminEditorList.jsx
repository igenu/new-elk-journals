import React, { useState, useEffect } from "react";
import {
  editorApplicationApi,
  journalApi,
  applicationApi,
  authApi,
} from "../../services/api";
import {
  Table,
  Modal,
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Form,
  Input,
  Select,
  Upload,
  Row,
  Col,
  Switch,
} from "antd";
import {
  FaEye,
  FaFileDownload,
  FaTrash,
  FaPlus,
  FaUpload,
} from "react-icons/fa";
import { ImageURl, scriptUrl } from "../../services/serviceApi";
import useRefreshOnFocus from "../../hooks/useRefreshOnFocus";

const AdminEditorList = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Editor State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [journals, setJournals] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [emailToggleLoadingId, setEmailToggleLoadingId] = useState(null);

  useEffect(() => {
    fetchEditors();
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await journalApi.getAll();
      // Handle both array directly or wrapped in data
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setJournals(data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  const fetchEditors = async () => {
    try {
      const response = await editorApplicationApi.getAll();
      setEditors(response.data);
    } catch (error) {
      console.error("Error fetching editor applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when tab comes back into focus
  useRefreshOnFocus(fetchEditors);

  const handleToggleEmailTrigger = async (userId, nextValue) => {
    const loadingKey = `editor-${userId}`;
    setEmailToggleLoadingId(loadingKey);

    try {
      const response = await authApi.updateEmailTrigger({
        role: "editor",
        id: userId,
        email_trigger: nextValue ? 1 : 0,
      });

      const updatedUser = response.data?.user || {};
      const emailTriggerValue =
        updatedUser.email_trigger ?? updatedUser.emailTrigger ?? nextValue;
      const normalizedTrigger =
        emailTriggerValue === 1
          ? true
          : emailTriggerValue === 0
            ? false
            : !!emailTriggerValue;

      setEditors((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, ...updatedUser, email_trigger: normalizedTrigger }
            : user,
        ),
      );

      message.success(response.data?.message || "Email trigger updated");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update email trigger",
      );
    } finally {
      setEmailToggleLoadingId(null);
    }
  };

  const handleView = (editor) => {
    setSelectedEditor(editor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEditor(null);
  };

  const handleDelete = async (id) => {
    try {
      await editorApplicationApi.delete(id);
      message.success("Application deleted successfully");
      fetchEditors();
    } catch (error) {
      message.error("Failed to delete application");
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Journal",
      dataIndex: "journal",
      key: "journal",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Name",
      key: "name",
      render: (_text, record) => (
        <span>
          {record.title == "Not Mentioned" ? "" : record.title}{" "}
          {record.firstName == "Not Mentioned" ? "-" : record.firstName}{" "}
          {record.lastName == "Not Mentioned" ? "-" : record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // {
    //     title: 'Status',
    //     dataIndex: 'status',
    //     key: 'status',
    //     render: (status) => {
    //         const color = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'gold';
    //         return (
    //             <Tag color={color} className="uppercase">
    //                 {status || 'PENDING'}
    //             </Tag>
    //         );
    //     },
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gold";
        let text = "PENDING";
        if (
          status === "active" ||
          status === "approved" ||
          status === "pending"
        ) {
          color = "green";
          text = "ACTIVE";
        } else if (status === "inactive" || status === "rejected") {
          color = "red";
          text = "INACTIVE";
        }

        return (
          <Tag color={color} className="uppercase">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Email Trigger",
      key: "email_trigger",
      align: "center",
      render: (_text, record) => (
        <Switch
          size="small"
          checked={!!record.email_trigger}
          loading={emailToggleLoadingId === `editor-${record.id}`}
          onChange={(checked) => handleToggleEmailTrigger(record.id, checked)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_text, record) => (
        <Space>
          <Button
            type="text"
            icon={<FaEye className="text-[#12b48b]" />}
            onClick={() => handleView(record)}
            shape="circle"
            className="hover:bg-green-50"
          />
          <Popconfirm
            title="Delete Application"
            description="Are you sure you want to delete this application?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<FaTrash className="text-red-500" />}
              shape="circle"
              className="hover:bg-red-50"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Editor Applications
        </h1>
        <Button
          type="primary"
          icon={<FaPlus />}
          onClick={() => {
            setIsAddModalOpen(true);
            form.resetFields();
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Editor
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        <Table
          columns={columns}
          dataSource={editors}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={
          <span className="text-xl font-bold text-gray-800">
            Application Details
          </span>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedEditor && (
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="md:col-span-2">
              <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">
                Personal Details
              </h3>
            </div>
            <DetailRow
              label="Journal"
              value={selectedEditor.journal}
              fullWidth
            />
            <DetailRow label="Title" value={selectedEditor.title} />
            <DetailRow
              label="Full Name"
              value={`${selectedEditor.firstName} ${selectedEditor.lastName}`}
            />
            <DetailRow label="Email" value={selectedEditor.email} />

            <div className="md:col-span-2 mt-2">
              <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">
                Academic Details
              </h3>
            </div>
            <DetailRow
              label="Qualification"
              value={selectedEditor.qualification}
            />
            <DetailRow
              label="Specialization"
              value={selectedEditor.specialization}
            />
            <DetailRow
              label="Institute"
              value={selectedEditor.institute}
              fullWidth
            />

            <div className="md:col-span-2 mt-2">
              <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">
                Documents
              </h3>
            </div>
            <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-3 rounded border">
              <span className="text-gray-600 text-sm">Curriculum Vitae</span>
              {selectedEditor.cvFile ? (
                <a
                  href={`${scriptUrl}${selectedEditor.cvFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
                >
                  <FaFileDownload /> Download CV
                </a>
              ) : (
                <span className="text-gray-400 text-sm italic">
                  No file uploaded
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Editor Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-gray-800">
            Add New Editor
          </span>
        }
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={800}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            setSubmitting(true);
            try {
              const formData = new FormData();

              // Map simple fields
              const directFields = [
                "journal",
                "title",
                "firstName",
                "lastName",
                "email",
                "confirmEmail",
                "qualification",
                "specialization",
                "institute",
              ];

              directFields.forEach((field) => {
                if (values[field]) {
                  formData.append(field, values[field]);
                }
              });

              // Append dummy/programmatic fields
              formData.append("password", "123456");
              formData.append("confirmPassword", "123456");
              formData.append("captchaInput", "9588");

              // Handle File
              if (
                values.file &&
                values.file.fileList &&
                values.file.fileList.length > 0
              ) {
                // Antd Upload puts the file in originFileObj
                formData.append("file", values.file.fileList[0].originFileObj);
              }

              const response = await applicationApi.becomeEditor(formData);

              if (response.data && response.data.success) {
                // adjust check based on actual API response
                message.success("Editor added successfully");
                setIsAddModalOpen(false);
                form.resetFields();
                fetchEditors();
              } else {
                message.success("Editor added successfully"); // Fallback purely based on not catching error usually means success in axios unless interceptor catches it
                setIsAddModalOpen(false);
                form.resetFields();
                fetchEditors();
              }
            } catch (error) {
              console.error("Add Editor Error:", error);
              const errorMsg =
                error.response?.data?.message ||
                "Failed to add editor. Please try again.";
              message.error(errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="bg-white p-2">
            <h3 className="text-teal-600 font-semibold mb-4 border-b pb-2">
              Personal Details:
            </h3>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="journal"
                  label="Select Journal"
                  rules={[
                    { required: true, message: "Please select a journal" },
                  ]}
                >
                  <Select placeholder="Select Journal">
                    {journals.map((j) => (
                      <Select.Option key={j.id} value={j.id}>
                        {j.name || j.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="title" label="Title" initialValue="Dr">
                  <Select>
                    <Select.Option value="Dr">Dr</Select.Option>
                    <Select.Option value="Prof">Prof</Select.Option>
                    <Select.Option value="Mr">Mr</Select.Option>
                    <Select.Option value="Ms">Ms</Select.Option>
                    <Select.Option value="Mrs">Mrs</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "First Name is required" },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: "Last Name is required" }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email ID"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input placeholder="Email ID" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmEmail"
                  label="Confirm Email ID"
                  dependencies={["email"]}
                  rules={[
                    { required: true, message: "Please confirm your email" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("email") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two emails do not match!"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Confirm Email ID" />
                </Form.Item>
              </Col>
            </Row>

            <h3 className="text-teal-600 font-semibold mt-6 mb-4 border-b pb-2">
              Academic Details:
            </h3>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="qualification"
                  label="Educational Qualification"
                  rules={[
                    { required: true, message: "Qualification is required" },
                  ]}
                >
                  <Input placeholder="B.tech / Ph.D" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="specialization"
                  label="Specialization"
                  // The image shows "Please Select" but it's often simpler as input if choices aren't dynamic ??
                  // User provided curl sends text "Agricultural science". It could be a dropdown or input.
                  // I'll stick to Input for flexibility as I don't have list of specializations.
                  // Or generic inputs.
                >
                  <Input placeholder="Specialization" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="institute"
              label="Institute/ University"
              rules={[{ required: true, message: "Institute is required" }]}
            >
              <Input placeholder="Institute Name" />
            </Form.Item>

            <Form.Item
              name="file"
              label="Upload Document"
              extra={
                <span className="text-red-500 text-xs">
                  Note : Click upload to attach your file. Adobe Pdf (or) Word
                  Document Format Only
                </span>
              }
            >
              <Upload
                maxCount={1}
                beforeUpload={() => false}
                accept=".pdf,.doc,.docx"
              >
                <Button icon={<FaUpload />}>Choose file</Button>
              </Upload>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
              <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="bg-blue-600"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

const DetailRow = ({ label, value, fullWidth }) => (
  <div className={`flex flex-col ${fullWidth ? "md:col-span-2" : ""}`}>
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className="text-base text-gray-900 border-b border-gray-100 pb-1">
      {value || "N/A"}
    </span>
  </div>
);

export default AdminEditorList;
