import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tooltip,
  Modal,
  message,
  Tag,
  Badge,
} from "antd";
import {
  FaEye,
  FaTrash,
  FaFileAlt,
  FaUsers,
  FaExternalLinkAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { journalApi } from "../services/api";

const JournalTable = ({ journals, onDelete }) => {
  const navigate = useNavigate();
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteConfirm = (journalId) => {
    setDeleteConfirmId(journalId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmId(null);
  };

  const handleDeleteJournal = async () => {
    if (!deleteConfirmId) return;

    setLoadingDeleteId(deleteConfirmId);
    try {
      const response = await journalApi.delete(deleteConfirmId);
      if (response.data?.success) {
        message.success(
          response.data?.message || "Journal deleted successfully",
        );
        if (onDelete) {
          onDelete(deleteConfirmId);
        }
        closeDeleteConfirm();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete journal",
      );
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleViewEditorApplications = (journalEncryptedId) => {
    navigate(`/dashboard/journal-editor-applications/${journalEncryptedId}`);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
      width: 70,
      fixed: "left",
      render: (text, record, index) => (
        <span className="font-medium text-gray-600">{index + 1}</span>
      ),
    },
    {
      title: "Journal Title",
      dataIndex: "title",
      key: "title",
      width: 280,
      fixed: "left",
      render: (title) => (
        <Tooltip placement="topLeft" title={title}>
          <span className="font-medium text-gray-800">{title}</span>
        </Tooltip>
      ),
    },
    {
      title: "Start Year",
      dataIndex: "start_year",
      key: "start_year",
      width: 100,
      align: "center",
      responsive: ["md"],
      render: (year) => (
        <Tag color="default" className="font-mono">
          {year || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      width: 120,
      align: "center",
      responsive: ["lg"],
      render: (frequency) => (
        <span className="text-gray-600 capitalize">{frequency || "N/A"}</span>
      ),
    },
    {
      title: "Print ISSN",
      dataIndex: "print_issn",
      key: "print_issn",
      width: 130,
      align: "center",
      responsive: ["lg"],
      render: (issn) => (
        <span className="font-mono text-sm text-gray-700">{issn || "—"}</span>
      ),
    },
    {
      title: "E-ISSN",
      dataIndex: "e_issn",
      key: "e_issn",
      width: 130,
      align: "center",
      responsive: ["xl"],
      render: (issn) => (
        <span className="font-mono text-sm text-gray-700">{issn || "—"}</span>
      ),
    },
    {
      title: "Manuscripts",
      key: "submittedManuscripts",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Tooltip title="View Submitted Manuscripts">
          <Link to={`/dashboard/manuscripts?journalId=${record.id}`}>
            <Button
              type="default"
              size="small"
              icon={<FaFileAlt className="text-blue-500" />}
              className="flex items-center gap-1 border-blue-200 hover:border-blue-400 hover:text-blue-600"
            >
              <span className="hidden sm:inline">View</span>
              <FaExternalLinkAlt className="text-xs opacity-50" />
            </Button>
          </Link>
        </Tooltip>
      ),
    },
    {
      title: "Editor Apps",
      key: "editorApplications",
      width: 130,
      align: "center",
      render: (_, record) => {
        const count = record.editorApplications?.length || 0;
        return (
          <div className="flex items-center justify-center gap-2">
            <Badge
              count={count}
              showZero
              color={count > 0 ? "#12b48b" : "#d9d9d9"}
              style={{ fontSize: "12px" }}
            />
            {count > 0 && (
              <Tooltip title="View Editor Applications">
                <Button
                  type="text"
                  size="small"
                  icon={<FaUsers className="text-[#12b48b]" />}
                  className="hover:bg-green-50"
                  onClick={() =>
                    handleViewEditorApplications(record.encryptedId)
                  }
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Journal Details">
            <Link to={`/dashboard/view-journal/${record.encryptedId}`}>
              <Button
                type="primary"
                size="small"
                icon={<FaEye />}
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
              />
            </Link>
          </Tooltip>
          <Tooltip title="Delete Journal">
            <Button
              type="primary"
              danger
              size="small"
              icon={<FaTrash />}
              onClick={() => openDeleteConfirm(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          dataSource={journals}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} journals`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          scroll={{ x: 1200 }}
          size="middle"
          className="journal-table"
          rowClassName={(_record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <FaExclamationTriangle />
            <span>Delete Journal</span>
          </div>
        }
        open={isDeleteModalOpen}
        onCancel={closeDeleteConfirm}
        centered
        footer={[
          <Button key="cancel" onClick={closeDeleteConfirm}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={loadingDeleteId === deleteConfirmId}
            onClick={handleDeleteJournal}
            icon={<FaTrash />}
          >
            Delete
          </Button>,
        ]}
      >
        <div className="py-4">
          <p className="text-gray-700 text-base">
            Are you sure you want to delete this journal?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone. All associated data including
            manuscripts and editor applications may be affected.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default JournalTable;
