import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  Select,
  Input,
} from "antd";
import {
  FaArrowLeft,
  FaDownload,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaInfoCircle,
  FaEdit,
  FaFileContract,
  FaGlobe,
} from "react-icons/fa";
import { manuscriptApi, editorManuscriptApi } from "../../services/api";
import { scriptUrl } from "../../services/serviceApi";
import StatusTimeline from "../../components/StatusTimeline";

const { Title, Text, Paragraph } = Typography;

const ManuscriptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const journalId = location.state?.journalId;
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [editors, setEditors] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const previousStatusRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const fetchDetails = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await manuscriptApi.getById(id);
      const data = response.data.data;

      // Check if status changed (for polling updates)
      if (previousStatusRef.current && previousStatusRef.current !== data.status) {
        message.info(`Status updated to "${data.status}"`);
      }
      previousStatusRef.current = data.status;

      setManuscript(data);
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      if (showLoading) message.error("Failed to fetch manuscript details.");
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

  // Fetch approved editors for assignment dropdown
  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const response = await editorManuscriptApi.getApprovedEditors();
        setEditors(response.data.data);
      } catch (error) {
        console.error('Error fetching editors:', error);
      }
    };
    fetchEditors();
  }, []);

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

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      message.error("Please select a status");
      return;
    }
    if (!adminComment.trim()) {
      message.error("Comment is mandatory");
      return;
    }

    setUpdating(true);
    try {
      await manuscriptApi.updateStatus(id, {
        status: newStatus,
        comment: adminComment,
        statusUpdatedBy: "1",
      });
      message.success("Manuscript status updated successfully");

      // Refresh details
      const response = await manuscriptApi.getById(id);
      setManuscript(response.data.data);
      setNewStatus(null);
      setAdminComment("");
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignEditor = async () => {
    if (!selectedEditor) {
      message.error('Please select an editor');
      return;
    }

    setIsAssigning(true);
    try {
      await editorManuscriptApi.assignEditor(id, selectedEditor);
      message.success('Editor assigned successfully');
      fetchDetails(); // Refresh manuscript details
      setSelectedEditor(null);
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to assign editor');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleFinalDecision = async () => {
    if (!newStatus) {
      message.error('Please select a decision');
      return;
    }
    if (!adminComment.trim()) {
      message.error('Comment is mandatory');
      return;
    }

    setUpdating(true);
    try {
      await editorManuscriptApi.adminFinalDecision(id, newStatus, adminComment);
      message.success('Final decision submitted successfully');
      fetchDetails();
      setNewStatus(null);
      setAdminComment('');
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to submit decision');
    } finally {
      setUpdating(false);
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
        <Button onClick={() => navigate(journalId ? `/dashboard/manuscripts?journalId=${journalId}` : "/dashboard/manuscripts")}>
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
      width: 200,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<FaUser />} size="small" className="bg-[#12b48b]" />
          <Text strong>
            {record.first_name} {record.last_name}
          </Text>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Institution",
      dataIndex: "institution",
      key: "institution",
      responsive: ["lg"],
      width: 200,
      ellipsis: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      responsive: ["xl"],
      width: 180,
      ellipsis: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      responsive: ["md"],
      width: 150,
    },
    {
      title: "Role",
      key: "role",
      width: 140,
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
      case "pending":
        return "gold";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      case "awaiting copyright":
        return "purple";
      case "copyright received":
        return "lime";
      case "assigned to editor":
        return "blue";
      case "accepted by editor":
        return "cyan";
      case "assigned to reviewer":
        return "processing";
      case "awaiting revised manuscript":
        return "orange";
      case "submitted":
        return "geekblue";
      case "under review":
        return "volcano";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header / Navigation */}
      <div className="mb-6 flex justify-between items-center">
        <Button
          icon={<FaArrowLeft />}
          onClick={() => navigate(journalId ? `/dashboard/manuscripts?journalId=${journalId}` : "/dashboard/manuscripts")}
          type="text"
          className="hover:bg-gray-200"
        >
          Back to List
        </Button>
        <Space>
          <Tag
            color={getStatusColor(manuscript.status)}
            className="px-3 py-1 text-sm font-medium uppercase tracking-wide"
          >
            {manuscript.status || "Unknown Status"}
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
              className="border-t"
              scroll={{ x: 'max-content' }}
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
                    {manuscript.checklist[item.key] ? (
                      <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                    ) : (
                      <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
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
                  navigate(`/dashboard/manuscripts/${id}/copyright`)
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
          <StatusTimeline manuscript={manuscript} />

          {/* Status Actions Card */}
          <Card
            title={
              <span className="text-[#204066] font-semibold flex items-center gap-2">
                <FaEdit /> Status & Actions
              </span>
            }
            className="shadow-sm border-0 mb-6 rounded-lg bg-white"
          >
            {manuscript.status?.toLowerCase() === "pending" ? (
              <div className="space-y-4">
                {/* Editor Assignment Section */}
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <Text className="block mb-2 text-sm font-semibold text-blue-800">
                    Assign to Editor
                  </Text>
                  <Select
                    placeholder="Select Editor"
                    style={{ width: "100%" }}
                    value={selectedEditor}
                    onChange={setSelectedEditor}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={editors.map(editor => ({
                      value: editor.id,
                      label: `${editor.name} - ${editor.specialization}`,
                    }))}
                  />
                  <Button
                    type="primary"
                    block
                    onClick={handleAssignEditor}
                    loading={isAssigning}
                    disabled={!selectedEditor}
                    className="bg-[#12b48b] border-[#12b48b] hover:bg-[#0e9470] mt-3"
                  >
                    Assign Editor
                  </Button>
                </div>
              </div>
            ) : manuscript.status?.toLowerCase() === 'accepted by editor' ? (
              <div className="space-y-4">
                {/* Editor's Decision Display */}
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <Text className="block text-sm font-medium text-green-800 mb-1">
                    Editor Accepted This Manuscript
                  </Text>
                  <Text className="block text-xs text-green-600">
                    {manuscript.editor_comment}
                  </Text>
                  {manuscript.assignedEditor && (
                    <Text className="block text-xs text-green-600 mt-2">
                      Editor: {manuscript.assignedEditor.name} - {manuscript.assignedEditor.specialization}
                    </Text>
                  )}
                </div>

                {/* Admin Final Decision Section */}
                <div>
                  <Text className="block mb-1 text-sm font-medium">
                    Final Decision <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    placeholder="Accept or Reject"
                    style={{ width: "100%" }}
                    value={newStatus}
                    onChange={setNewStatus}
                    options={[
                      { value: "accept", label: "Accept" },
                      { value: "reject", label: "Reject" }
                    ]}
                  />
                </div>

                <div>
                  <Text className="block mb-1 text-sm font-medium">
                    Final Comment <span className="text-red-500">*</span>
                  </Text>
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter your final decision comment..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                </div>

                <Button
                  type="primary"
                  block
                  onClick={handleFinalDecision}
                  loading={updating}
                  className="bg-[#12b48b] border-[#12b48b] hover:bg-[#0e9470]"
                >
                  Submit Final Decision
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <Text type="secondary">Current Status</Text>
                  <Tag
                    color={getStatusColor(manuscript.status)}
                    className="m-0 px-3 py-1 text-sm uppercase font-semibold"
                  >
                    {manuscript.status}
                  </Tag>
                </div>

                {/* Show Editor Status if available */}
                {manuscript.editor_status && (
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <Text type="secondary">Editor Status</Text>
                    <Tag
                      color={manuscript.editor_status === 'Rejected by Editor' ? 'red' : 'blue'}
                      className="m-0 px-3 py-1 text-sm uppercase font-semibold"
                    >
                      {manuscript.editor_status}
                    </Tag>
                  </div>
                )}

                {/* Show Assigned Editor if available */}
                {manuscript.assignedEditor && (
                  <div className="border-b border-gray-100 pb-3">
                    <Text type="secondary" className="block mb-1 text-xs uppercase tracking-wide">
                      Assigned Editor
                    </Text>
                    <Text className="text-gray-700">
                      {manuscript.assignedEditor.name} - {manuscript.assignedEditor.specialization}
                    </Text>
                  </div>
                )}

                {/* Show Editor Comment if available */}
                {manuscript.editor_comment && (
                  <div className="border-b border-gray-100 pb-3">
                    <Text type="secondary" className="block mb-1 text-xs uppercase tracking-wide">
                      Editor Comment
                    </Text>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700 text-sm">
                      {manuscript.editor_comment}
                    </div>
                  </div>
                )}

                <div>
                  <Text
                    type="secondary"
                    className="block mb-2 text-xs uppercase tracking-wide"
                  >
                    Admin Comment
                  </Text>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700 text-sm">
                    {manuscript.comment || manuscript.admin_final_comment || (
                      <span className="italic text-gray-400">
                        No comment provided.
                      </span>
                    )}
                  </div>
                </div>
                {(manuscript.status?.toLowerCase() === "awaiting copyright" ||
                  manuscript.status?.toLowerCase() === "accepted") && (
                    <Button
                      type="primary"
                      block
                      icon={<FaFileContract />}
                      onClick={() =>
                        navigate(
                          `/dashboard/manuscripts/${manuscript.manuscript_id}/copyright`,
                        )
                      }
                      className="bg-purple-600 border-purple-600 hover:bg-purple-700 h-10"
                    >
                      See Copyright
                    </Button>
                  )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManuscriptDetails;
