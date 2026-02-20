import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Descriptions,
  Typography,
  Card,
  Table,
  Button,
  Tag,
  message,
  Divider,
  Space,
  Row,
  Col,
  Avatar,
  Tooltip,
  Modal,
  Input,
} from "antd";
import {
  FaArrowLeft,
  FaDownload,
  FaFilePdf,
  FaCheckCircle,
  FaUser,
  FaInfoCircle,
  FaFileContract,
  FaGlobe,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { manuscriptApi, editorManuscriptApi } from "../../services/api";
import { scriptUrl } from "../../services/serviceApi";
import StatusTimeline from "../../components/StatusTimeline";

const { Title, Text, Paragraph } = Typography;

const EditorManuscriptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await manuscriptApi.getById(id);
      setManuscript(response.data.data);
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      message.error("Failed to fetch manuscript details.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (action) => {
    setReviewAction(action);
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = async () => {
    if (!reviewComment.trim()) {
      message.error("Comment is mandatory");
      return;
    }

    setSubmitting(true);
    try {
      await editorManuscriptApi.editorReview(id, reviewAction, reviewComment);
      message.success(`Manuscript ${reviewAction}ed successfully`);
      setReviewModalVisible(false);
      setReviewComment("");
      fetchDetails(); // Refresh details
    } catch (error) {
      message.error(error.response?.data?.error || `Failed to ${reviewAction} manuscript`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Loading manuscript details..." />
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="p-12 text-center bg-gray-50 min-h-screen">
        <Title level={4}>Manuscript not found</Title>
        <Button onClick={() => navigate("/dashboard/editor/manuscripts")}>
          Back to List
        </Button>
      </div>
    );
  }

  const authorColumns = [
    {
      title: "Name",
      key: "name",
      fixed: "left",
      width: 180,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<FaUser />} size="small" className="bg-[#12b48b]" />
          <Tooltip title={`${record.first_name} ${record.last_name}`}>
            <Text strong className="truncate">
              {record.first_name} {record.last_name}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          <span>{email}</span>
        </Tooltip>
      ),
    },
    {
      title: "Institution",
      dataIndex: "institution",
      key: "institution",
      responsive: ["md"],
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (institution) => (
        <Tooltip placement="topLeft" title={institution}>
          <span>{institution}</span>
        </Tooltip>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      responsive: ["lg"],
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (department) => (
        <Tooltip placement="topLeft" title={department}>
          <span>{department}</span>
        </Tooltip>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      responsive: ["md"],
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render: (country) => (
        <Tooltip placement="topLeft" title={country}>
          <span>{country}</span>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: 130,
      render: (text, record) =>
        record.is_corresponding_author ? (
          <Tag color="blue">Corresponding</Tag>
        ) : (
          <Tag>Author</Tag>
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
    switch (status?.toLowerCase()) {
      case "pending review":
        return "orange";
      case "accepted by editor":
        return "green";
      case "rejected by editor":
        return "red";
      default:
        return "blue";
    }
  };

  const isPendingReview = !manuscript.editor_status || manuscript.editor_status === 'Pending Review';

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header / Navigation */}
      <div className="mb-6 flex justify-between items-center">
        <Button
          icon={<FaArrowLeft />}
          onClick={() => navigate("/dashboard/editor/manuscripts")}
          type="text"
          className="hover:bg-gray-200"
        >
          Back to List
        </Button>
        <Space>
          <Tag
            color={getStatusColor(manuscript.editor_status)}
            className="px-3 py-1 text-sm font-medium uppercase tracking-wide"
          >
            {manuscript.editor_status || "Pending Review"}
          </Tag>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* LEFT COLUMN: Main Content */}
        <Col xs={24} lg={16}>
          {/* 1. Header Card */}
          <Card className="shadow-sm border-0 mb-6 rounded-lg overflow-hidden">
            <div className="border-l-4 border-[#12b48b] pl-4">
              <Text
                type="secondary"
                className="block text-xs uppercase tracking-wider mb-1"
              >
                {manuscript.manuscript_id} &bull; {manuscript.manuscript_type}
              </Text>
              <Title
                level={2}
                className="mt-0 mb-2 leading-tight text-[#204066]"
              >
                {manuscript.paper_title}
              </Title>
              <Text type="secondary">
                Submitted on{" "}
                <span className="text-gray-800 font-medium">
                  {new Date(manuscript.createdAt).toLocaleDateString()}
                </span>
              </Text>
            </div>
          </Card>

          {/* 2. Abstract & Keywords */}
          <Card
            title={
              <span className="text-[#204066] font-semibold flex items-center gap-2">
                <FaInfoCircle /> Abstract & Keywords
              </span>
            }
            className="shadow-sm border-0 mb-6 rounded-lg"
          >
            <Paragraph className="text-gray-700 leading-relaxed text-justify mb-6">
              {manuscript.abstract}
            </Paragraph>
            <Divider
              plain
              orientation="left"
              className="m-0 mb-3 text-xs text-gray-400"
            >
              KEYWORDS
            </Divider>
            <div className="flex flex-wrap gap-2">
              {manuscript.keywords?.split(",").map((keyword, index) => (
                <Tag
                  key={index}
                  className="px-3 py-1 bg-gray-100 border-transparent text-gray-600 rounded-full"
                >
                  {keyword.trim()}
                </Tag>
              ))}
            </div>
          </Card>

          {/* 3. Authors Table */}
          <Card
            title={
              <span className="text-[#204066] font-semibold flex items-center gap-2">
                <FaUser /> Authors
              </span>
            }
            className="shadow-sm border-0 mb-6 rounded-lg"
          >
            <Table
              dataSource={manuscript.authors}
              columns={authorColumns}
              pagination={false}
              rowKey="id"
              size="middle"
              bordered
              className="border-t"
              scroll={{ x: 1000 }}
            />
          </Card>

          {/* 4. Checklist */}
          {manuscript.checklist && (
            <Card
              title={
                <span className="text-[#204066] font-semibold flex items-center gap-2">
                  <FaCheckCircle /> Submission Checklist
                </span>
              }
              className="shadow-sm border-0 mb-6 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100"
                  >
                    <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
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

          {/* 5. Suggested Reviewer */}
          <Card
            title={
              <span className="text-[#204066] font-semibold flex items-center gap-2">
                <FaUser /> Suggested Reviewer
              </span>
            }
            className="shadow-sm border-0 mb-6 rounded-lg"
          >
            <Descriptions
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              size="small"
            >
              <Descriptions.Item label="Name">
                {manuscript.reviewer_first_name} {manuscript.reviewer_last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {manuscript.reviewer_email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {manuscript.reviewer_phone}
              </Descriptions.Item>
              <Descriptions.Item label="Institution">
                {manuscript.reviewer_institution}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {manuscript.reviewer_department}
              </Descriptions.Item>
              <Descriptions.Item label="Specialisation">
                {manuscript.reviewer_specialisation}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {manuscript.reviewer_city}, {manuscript.reviewer_country}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* RIGHT COLUMN: Sidebar Metadata */}
        <Col xs={24} lg={8}>
          {/* Metadata Card */}
          <Card className="shadow-sm border-0 mb-6 rounded-lg bg-[#f8fafc]">
            <Title level={5} className="mb-4 text-[#204066]">
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
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <Text type="secondary">Journal</Text>
                <div className="text-right">
                  <Text strong className="block">
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
          <Card className="shadow-sm border-0 mb-6 rounded-lg">
            <Title level={5} className="mb-4 text-[#204066]">
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
                      IP Address
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Attachments */}
          <Card className="shadow-sm border-0 mb-6 rounded-lg">
            <Title level={5} className="mb-4 text-[#204066]">
              Attachments
            </Title>
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
                  navigate(`/dashboard/editor/manuscripts/${id}/copyright`)
                }
                className="h-10 border-[#12b48b] text-[#12b48b] hover:bg-[#12b48b] hover:text-white"
              >
                View Copyright Form
              </Button>
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
          <StatusTimeline manuscript={manuscript} />

          {/* Review Actions Card */}
          <Card
            title={
              <span className="text-[#204066] font-semibold flex items-center gap-2">
                <FaCheckCircle /> Editor Review
              </span>
            }
            className="shadow-sm border-0 mb-6 rounded-lg bg-white"
          >
            {isPendingReview ? (
              <div className="space-y-3">
                <Text className="block mb-3 text-sm text-gray-600">
                  Review this manuscript and provide your decision with mandatory comment.
                </Text>
                <Button
                  type="primary"
                  block
                  icon={<FaThumbsUp />}
                  onClick={() => handleReviewClick('accept')}
                  className="bg-green-600 border-green-600 hover:bg-green-700 h-10"
                >
                  Accept Manuscript
                </Button>
                <Button
                  danger
                  block
                  icon={<FaThumbsDown />}
                  onClick={() => handleReviewClick('reject')}
                  className="h-10"
                >
                  Reject Manuscript
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <Text type="secondary">Your Decision</Text>
                  <Tag
                    color={getStatusColor(manuscript.editor_status)}
                    className="m-0 px-3 py-1 text-sm uppercase font-semibold"
                  >
                    {manuscript.editor_status}
                  </Tag>
                </div>
                <div>
                  <Text
                    type="secondary"
                    className="block mb-2 text-xs uppercase tracking-wide"
                  >
                    Your Comment
                  </Text>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700 text-sm">
                    {manuscript.editor_comment || (
                      <span className="italic text-gray-400">
                        No comment provided.
                      </span>
                    )}
                  </div>
                </div>
                {manuscript.editor_reviewed_at && (
                  <div>
                    <Text type="secondary" className="text-xs">
                      Reviewed on: {new Date(manuscript.editor_reviewed_at).toLocaleDateString()}
                    </Text>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Review Modal */}
      <Modal
        title={
          <span className="text-[#204066] font-semibold">
            {reviewAction === 'accept' ? 'Accept' : 'Reject'} Manuscript
          </span>
        }
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setReviewComment("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setReviewModalVisible(false);
              setReviewComment("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleReviewSubmit}
            className={reviewAction === 'accept' ?
              "bg-green-600 border-green-600 hover:bg-green-700" :
              ""
            }
            danger={reviewAction === 'reject'}
          >
            Submit {reviewAction === 'accept' ? 'Acceptance' : 'Rejection'}
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className={`p-3 rounded border ${reviewAction === 'accept' ?
            'bg-green-50 border-green-200' :
            'bg-red-50 border-red-200'
            }`}>
            <Text className={`block text-sm font-medium ${reviewAction === 'accept' ? 'text-green-800' : 'text-red-800'
              }`}>
              {reviewAction === 'accept' ?
                'You are about to ACCEPT this manuscript. The admin will review your decision for final approval.' :
                'You are about to REJECT this manuscript. This action will mark the manuscript as finally rejected.'
              }
            </Text>
          </div>
          <div>
            <Text className="block mb-2 text-sm font-medium">
              Comment <span className="text-red-500">*</span>
            </Text>
            <Input.TextArea
              rows={6}
              placeholder="Enter your detailed review comment (mandatory)..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditorManuscriptDetails;
