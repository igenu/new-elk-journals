import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Tag,
  Spin,
  Button,
  message,
  Divider,
  Table,
  Typography,
  Row,
  Col,
  Descriptions,
  Breadcrumb,
  Avatar,
  Tooltip,
  Space,
  Modal,
} from "antd";
import {
  FaArrowLeft,
  FaFilePdf,
  FaImage,
  FaUser,
  FaAlignLeft,
  FaInfoCircle,
  FaUsers,
  FaClipboardList,
  FaEye,
  FaCheckCircle,
  FaDownload,
  FaGlobe,
  FaFileContract,
} from "react-icons/fa";
import { manuscriptApi } from "../../services/api";
import { scriptUrl } from "../../services/serviceApi";
import StatusTimeline from "../../components/StatusTimeline";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const MyManuscriptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorModalVisible, setAuthorModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const previousStatusRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const fetchDetails = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await manuscriptApi.getById(id);
      // Handle both structure types { data: { ... } } or { ... }
      const data = response.data.data ? response.data.data : response.data;

      // Check if status changed (for polling updates)
      if (previousStatusRef.current && previousStatusRef.current !== data.status) {
        message.info(`Manuscript status updated to "${data.status}"`);
      }
      previousStatusRef.current = data.status;

      setManuscript(data);
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      if (showLoading) message.error("Failed to load manuscript details");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id]);

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id, fetchDetails]);

  // Polling for status updates (every 10 seconds)
  useEffect(() => {
    if (!id || loading) return;

    pollingIntervalRef.current = setInterval(() => {
      fetchDetails(false); // Silent fetch without loading state
    }, 10000); // Poll every 10 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [id, loading, fetchDetails]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  if (!manuscript)
    return (
      <div className="p-6 text-center text-gray-500">Manuscript not found</div>
    );

  const authorColumns = [
    {
      title: "Name",
      key: "name",
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<FaUser />} size="small" className="bg-[#12b48b]" />
          <div>
            <span className="font-medium text-gray-800">
              {r.first_name} {r.last_name}
            </span>
            {r.is_corresponding_author && (
              <Tag color="gold" className="ml-2 text-[10px]">
                Corresponding
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text copyable>{text}</Text>,
    },
    { title: "Institution", dataIndex: "institution", key: "institution" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          shape="circle"
          icon={<FaEye />}
          onClick={() => {
            setSelectedAuthor(record);
            setAuthorModalVisible(true);
          }}
          className="bg-[#12b48b] hover:bg-[#0e9f7a] border-none"
          size="small"
        />
      ),
    },
  ];

  const checklistItems = [
    { key: "is_sole_submission", label: "Sole Submission" },
    { key: "is_not_published", label: "Not Published Before" },
    { key: "is_original_work", label: "Original Work" },
    { key: "has_declared_conflicts", label: "Declared Conflicts" },
    { key: "has_acknowledged_support", label: "Acknowledged Support" },
    { key: "has_acknowledged_funding", label: "Acknowledged Funding" },
    { key: "follows_guidelines", label: "Follows Guidelines" },
  ];

  const getStatusColor = (status) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "submitted":
        return "blue";
      case "under review":
        return "orange";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            shape="circle"
            icon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            className="border-none shadow-sm text-gray-600 hover:text-[#12b48b] bg-white"
          />
          <div>
            <Title level={4} className="m-0 text-gray-800">
              Manuscript Details
            </Title>
            <Breadcrumb
              items={[
                { title: "Dashboard" },
                {
                  title: "My Manuscripts",
                  onClick: () => navigate("/dashboard/submit-manuscript"),
                  className: "cursor-pointer",
                },
                { title: manuscript.manuscript_id },
              ]}
            />
          </div>
        </div>

        <div className="text-right">
          <Tag
            color={getStatusColor(manuscript.status)}
            className="text-sm px-3 py-1 rounded-full font-semibold uppercase tracking-wider"
          >
            {manuscript.status}
          </Tag>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Main Content */}
        <Col xs={24} lg={16}>
          {/* Header Card */}
          <Card className="shadow-sm border-none rounded-xl mb-6 overflow-hidden">
            <div className="border-l-4 border-[#12b48b] pl-4">
              <Text
                type="secondary"
                className="block text-xs uppercase tracking-wider mb-1"
              >
                {manuscript.manuscript_id} &bull; {manuscript.manuscript_type}
              </Text>
              <Title
                level={3}
                className="mt-0 mb-2 leading-tight text-[#2c4a6e]"
              >
                {manuscript.paper_title}
              </Title>
              <Text type="secondary">
                Submitted on{" "}
                <span className="text-gray-800 font-medium">
                  {moment(manuscript.createdAt).format("DD MMM, YYYY")}
                </span>
              </Text>
            </div>
          </Card>

          {/* Abstract Card */}
          <Card
            className="shadow-sm border-none rounded-xl mb-6 overflow-hidden"
            title={
              <div className="flex items-center gap-2 text-[#2c4a6e] font-semibold">
                <FaAlignLeft /> Abstract
              </div>
            }
          >
            <Paragraph className="text-gray-600 text-justify leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              {manuscript.abstract}
            </Paragraph>
            <div className="flex flex-wrap gap-2">
              {manuscript.keywords?.split(",").map((word, i) => (
                <Tag
                  key={i}
                  className="bg-white border border-gray-200 text-gray-600 rounded-full px-3"
                >
                  {word.trim()}
                </Tag>
              ))}
            </div>
          </Card>

          {/* Checklist Card */}
          {manuscript.checklist && (
            <Card
              title={
                <span className="text-[#2c4a6e] font-semibold flex items-center gap-2">
                  <FaCheckCircle /> Submission Checklist
                </span>
              }
              className="shadow-sm border-none mb-6 rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistItems?.length > 0 &&
                  checklistItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      {manuscript.checklist[item.key] ? (
                        <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                      ) : (
                        <FaCheckCircle className="text-gray-300 text-lg flex-shrink-0" />
                      )}
                      <Text
                        className={
                          manuscript.checklist[item.key]
                            ? "text-gray-700 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {item.label}
                      </Text>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Authors Card */}
          <Card
            className="shadow-sm border-none rounded-xl mb-6"
            title={
              <div className="flex items-center gap-2 text-[#2c4a6e] font-semibold">
                <FaUsers /> Authors
              </div>
            }
          >
            <Table
              dataSource={manuscript.authors || []}
              columns={authorColumns}
              rowKey="id"
              pagination={false}
              size="small"
              className="no-border-table"
            />
          </Card>
        </Col>

        {/* Right Column: Sidebar Info */}
        <Col xs={24} lg={8}>
          {/* Metadata Card */}
          <Card className="shadow-sm border-none rounded-xl mb-6 bg-[#f8fafc]">
            <Title level={5} className="mb-4 text-[#2c4a6e]">
              Manuscript Details
            </Title>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <Text type="secondary">Word Count</Text>
                <div className="text-right">
                  <Text strong>{manuscript.word_count}</Text>
                  <div className="text-xs text-gray-500 italic">
                    {manuscript.no_of_words_text}
                  </div>
                </div>
              </div>
              {/* <div className="flex justify-between border-b border-gray-200 pb-2">
                                <Text type="secondary">Pages</Text>
                                <Text strong>{manuscript.page_count ?? 'N/A'}</Text>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <Text type="secondary">Tables / Figures</Text>
                                <Text strong>{manuscript.table_count || 0} / {manuscript.figure_count || 0}</Text>
                            </div> */}
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <Text type="secondary">Journal</Text>
                <div className="text-right">
                  <Text
                    strong
                    className="block max-w-[150px]"
                    title={manuscript.journal?.title}
                  >
                    {manuscript.journal?.title}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    ISSN: {manuscript.journal?.print_issn}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Submitter Info */}
          <Card className="shadow-sm border-none rounded-xl mb-6">
            <Title level={5} className="mb-4 text-[#2c4a6e]">
              Submitter Contact
            </Title>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaUser size={12} />
                </div>
                <div className="overflow-hidden">
                  <Text className="block text-sm font-medium">
                    {manuscript.submitter_name}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    Submitter
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaCheckCircle size={12} />
                </div>
                <div className="overflow-hidden">
                  <Tooltip title={manuscript.submitter_email}>
                    <Text className="block text-sm font-medium truncate">
                      {manuscript.submitter_email}
                    </Text>
                  </Tooltip>
                  <Text type="secondary" className="text-xs">
                    Email
                  </Text>
                </div>
              </div>
              {manuscript.submitter_ip_address && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaGlobe size={12} />
                  </div>
                  <div className="overflow-hidden">
                    <Text className="block text-sm font-medium font-mono">
                      {manuscript.submitter_ip_address}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      IP Address at Submission
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Files Card */}
          <Card
            className="shadow-sm border-none rounded-xl"
            title={
              <div className="flex items-center gap-2 text-[#2c4a6e] font-semibold">
                <FaClipboardList /> Documents
              </div>
            }
          >
            <Space direction="vertical" className="w-full">
              {manuscript.manuscript_file_path && (
                <Button
                  type="primary"
                  block
                  icon={<FaFilePdf />}
                  href={`${scriptUrl}${manuscript.manuscript_file_path}`}
                  target="_blank"
                  className="bg-[#12b48b] border-[#12b48b] hover:bg-[#0e9470] h-10"
                >
                  View Manuscript
                </Button>
              )}
              {manuscript.cover_letter_path && (
                <Button
                  block
                  icon={<FaDownload />}
                  href={`${scriptUrl}${manuscript.cover_letter_path}`}
                  target="_blank"
                  className="h-10"
                >
                  Cover Letter
                </Button>
              )}
              <Button
                block
                icon={<FaFileContract />}
                onClick={() =>
                  navigate(`/dashboard/submit-manuscript/${id}/copyright`)
                }
                className="h-10 border-[#12b48b] text-[#12b48b] hover:bg-[#12b48b] hover:text-white"
              >
                View Copyright Form
              </Button>
              {!manuscript.manuscript_file_path && (
                <Text type="secondary" className="text-center block italic">
                  No manuscript file.
                </Text>
              )}
            </Space>

            {manuscript.signature_file_path && (
              <div className="mt-6">
                <Text
                  type="secondary"
                  className="block text-xs mb-2 uppercase tracking-wide"
                >
                  Digital Signature
                </Text>
                <div className="p-2 border border-dashed border-gray-300 rounded bg-gray-50 flex justify-center">
                  <img
                    src={`${scriptUrl}${manuscript.signature_file_path}`}
                    alt="Signature"
                    className="h-16 object-contain opacity-80"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Status Timeline */}
          <div className="mt-6">
            <StatusTimeline manuscript={manuscript} />
          </div>

          {/* Status Overview Card */}
          <Card
            className="shadow-sm border-none rounded-xl mt-6"
            title={
              <div className="flex items-center gap-2 text-[#2c4a6e] font-semibold">
                <FaInfoCircle /> Status Overview
              </div>
            }
          >
            <div className="mb-4 flex items-center justify-between">
              <Text
                type="secondary"
                className="text-xs uppercase tracking-wider"
              >
                Current Status:
              </Text>
              <Tag
                color={getStatusColor(manuscript.status)}
                className="text-sm px-3 py-1 rounded-full font-semibold uppercase tracking-wider"
              >
                {manuscript.status}
              </Tag>
            </div>

            {manuscript.status?.toLowerCase() !== "pending" &&
              manuscript.comment && (
                <div>
                  <Divider className="my-3" />
                  <Text
                    type="secondary"
                    className="block text-xs mb-1 uppercase tracking-wider"
                  >
                    Admin Comment
                  </Text>
                  <Paragraph className="text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 mb-0">
                    {manuscript.comment}
                  </Paragraph>
                </div>
              )}
          </Card>
        </Col>
      </Row>

      {/* Author Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-[#12b48b]">
            <FaUsers /> Author Details
          </div>
        }
        open={authorModalVisible}
        onCancel={() => {
          setAuthorModalVisible(false);
          setSelectedAuthor(null);
        }}
        footer={[
          <Button key="close" onClick={() => setAuthorModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedAuthor && (
          <div className="pt-4">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="First Name" span={1}>
                {selectedAuthor.first_name}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name" span={1}>
                {selectedAuthor.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                <Text copyable>{selectedAuthor.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={2}>
                {selectedAuthor.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Institution" span={2}>
                {selectedAuthor.institution}
              </Descriptions.Item>
              <Descriptions.Item label="Department" span={2}>
                {selectedAuthor.department || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={1}>
                {selectedAuthor.country}
              </Descriptions.Item>
              <Descriptions.Item label="State/Province" span={1}>
                {selectedAuthor.state || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="City" span={1}>
                {selectedAuthor.city || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code" span={1}>
                {selectedAuthor.postal_code || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {selectedAuthor.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Corresponding Author" span={2}>
                <Tag
                  color={
                    selectedAuthor.is_corresponding_author ? "green" : "default"
                  }
                >
                  {selectedAuthor.is_corresponding_author ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyManuscriptDetails;
