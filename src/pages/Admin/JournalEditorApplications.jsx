import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Tag,
  Spin,
  message,
  Popconfirm,
  Descriptions,
  Empty,
  Switch,
  Collapse,
} from "antd";
import {
  FaArrowLeft,
  FaFileDownload,
  FaCheck,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";
import { journalApi, editorApplicationApi } from "../../services/api";
import { scriptUrl } from "../../services/serviceApi";

const JournalEditorApplications = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchJournalAndEditors();
  }, [journalId]);

  const fetchJournalAndEditors = async () => {
    setLoading(true);
    try {
      // Fetch journal details
      const journalResponse = await journalApi.getById(journalId);
      setJournal(journalResponse.data);

      // Fetch editor applications for this journal using the dedicated API
      const editorsResponse = await editorApplicationApi.getByJournalId(journalId);
      setEditors(editorsResponse.data || []);
    } catch (error) {
      console.error("Error fetching journal and editors:", error);
      message.error("Failed to fetch editor applications");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (editorId) => {
    setActionLoadingId(editorId);
    try {
      const response = await editorApplicationApi.updateStatus(editorId, "approved");
      if (response.data.success) {
        message.success(response.data.message);
        // Update local state
        setEditors((prev) =>
          prev.map((editor) =>
            editor.id === editorId
              ? { ...editor, status: "approved" }
              : editor
          )
        );
      }
    } catch (error) {
      console.error("Error approving editor:", error);
      message.error("Failed to approve editor");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (editorId) => {
    setActionLoadingId(editorId);
    try {
      const response = await editorApplicationApi.updateStatus(editorId, "rejected");
      if (response.data.success) {
        message.success(response.data.message);
        setEditors((prev) =>
          prev.map((editor) =>
            editor.id === editorId
              ? { ...editor, status: "rejected" }
              : editor
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting editor:", error);
      message.error("Failed to reject editor");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (editorId, isCurrentlyActive) => {
    setActionLoadingId(editorId);
    try {
      const response = await editorApplicationApi.toggleActive(editorId, !isCurrentlyActive);
      if (response.data.success) {
        message.success(response.data.message);
        setEditors((prev) =>
          prev.map((editor) =>
            editor.id === editorId
              ? {
                  ...editor,
                  is_active: !isCurrentlyActive,
                }
              : editor
          )
        );
      }
    } catch (error) {
      console.error("Error updating editor active status:", error);
      message.error("Failed to update editor status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusTag = (editor) => {
    const status = (editor.status || "pending").toLowerCase();
    const isActive = editor.is_active !== false;

    let statusColor = "gold";
    let statusText = "PENDING";

    if (status === "approved") {
      statusColor = "green";
      statusText = "APPROVED";
    } else if (status === "rejected") {
      statusColor = "red";
      statusText = "REJECTED";
    }

    return (
      <div className="flex gap-2">
        <Tag color={statusColor} className="uppercase">
          {statusText}
        </Tag>
        {status === "approved" && (
          <Tag color={isActive ? "blue" : "default"} className="uppercase">
            {isActive ? "ACTIVE" : "INACTIVE"}
          </Tag>
        )}
      </div>
    );
  };

  const isEditorActive = (editor) => {
    // Use the is_active field from database, default to true if not set
    return editor.is_active !== false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  const collapseItems = editors.map((editor) => ({
    key: editor.id,
    label: (
      <div className="flex items-center justify-between w-full pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#12b48b] rounded-full flex items-center justify-center">
            <FaUserTie className="text-white" />
          </div>
          <div>
            <span className="font-semibold capitalize">
              {editor.title !== "Not Mentioned" ? `${editor.title} ` : ""}
              {editor.firstName !== "Not Mentioned" ? editor.firstName : ""}{" "}
              {editor.lastName !== "Not Mentioned" ? editor.lastName : ""}
            </span>
            <div className="text-gray-500 text-sm">{editor.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusTag(editor)}
        </div>
      </div>
    ),
    children: (
      <div className="p-4">
        {/* Personal Details */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#12b48b] rounded"></span>
            Personal Details
          </h4>
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Title">
              {editor.title !== "Not Mentioned" ? editor.title : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Full Name">
              {editor.firstName !== "Not Mentioned" ? editor.firstName : ""}{" "}
              {editor.lastName !== "Not Mentioned" ? editor.lastName : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {editor.email || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Academic Details */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#12b48b] rounded"></span>
            Academic Details
          </h4>
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Qualification">
              {editor.qualification || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Specialization">
              {editor.specialization || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Institute / University" span={2}>
              {editor.institute || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Documents */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#12b48b] rounded"></span>
            Documents
          </h4>
          <div className="bg-gray-50 p-3 rounded-lg border flex items-center justify-between">
            <span className="text-gray-600">Curriculum Vitae</span>
            {editor.cvFile ? (
              <a
                href={`${scriptUrl}${editor.cvFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaFileDownload /> Download CV
              </a>
            ) : (
              <span className="text-gray-400 italic">No file uploaded</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Active/Inactive Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">Status:</span>
              <Switch
                checked={isEditorActive(editor)}
                onChange={() =>
                  handleToggleActive(editor.id, isEditorActive(editor))
                }
                loading={actionLoadingId === editor.id}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </div>

            {/* Approve/Reject Buttons */}
            {editor.status === "pending" && <div className="flex items-center gap-2">
              <Popconfirm
                title="Reject Application"
                description="Are you sure you want to reject this editor application?"
                onConfirm={() => handleReject(editor.id)}
                okText="Yes, Reject"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<FaTimes />}
                  loading={actionLoadingId === editor.id}
                  className="flex items-center"
                >
                  Reject
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Approve Application"
                description="Are you sure you want to approve this editor application?"
                onConfirm={() => handleApprove(editor.id)}
                okText="Yes, Approve"
                cancelText="Cancel"
              >
                <Button
                  type="primary"
                  icon={<FaCheck />}
                  loading={actionLoadingId === editor.id}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
              </Popconfirm>
            </div>}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Editor Applications
            </h1>
            {journal && (
              <p className="text-gray-500 text-sm mt-1">
                for <span className="font-medium">{journal.title}</span>
              </p>
            )}
          </div>
        </div>
        <Tag color="blue" className="text-sm px-3 py-1">
          {editors.length} Application{editors.length !== 1 ? "s" : ""}
        </Tag>
      </div>

      {/* Editor Applications List */}
      <Card className="shadow-md">
        {editors.length > 0 ? (
          <Collapse
            accordion
            items={collapseItems}
            defaultActiveKey={editors.length > 0 ? [editors[0].id] : []}
            className="bg-white"
          />
        ) : (
          <Empty
            description="No editor applications found for this journal"
            className="py-12"
          />
        )}
      </Card>
    </div>
  );
};

export default JournalEditorApplications;
