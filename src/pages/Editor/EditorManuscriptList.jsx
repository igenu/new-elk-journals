import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Tag, Button, message, Spin } from 'antd';
import { FaEye } from 'react-icons/fa';
import { editorManuscriptApi } from '../../services/api';
import moment from 'moment';

const EditorManuscriptList = () => {
  const navigate = useNavigate();
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingIntervalRef = useRef(null);

  const fetchAssignedManuscripts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await editorManuscriptApi.getMyAssignedManuscripts();
      setManuscripts(response.data.data);
    } catch (error) {
      if (showLoading) message.error('Failed to fetch assigned manuscripts');
      console.error('Error:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAssignedManuscripts();
  }, [fetchAssignedManuscripts]);

  // Polling for live data updates (every 10 seconds)
  useEffect(() => {
    if (loading) return;

    pollingIntervalRef.current = setInterval(() => {
      fetchAssignedManuscripts(false); // Silent fetch without loading state
    }, 10000); // Poll every 10 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [loading, fetchAssignedManuscripts]);

  const columns = [
    {
      title: 'Manuscript ID',
      dataIndex: 'manuscript_id',
      key: 'manuscript_id',
      width: 150,
    },
    {
      title: 'Title',
      dataIndex: 'paper_title',
      key: 'paper_title',
      ellipsis: true,
    },
    {
      title: 'Journal',
      key: 'journal',
      render: (_, record) => record.journal?.title || 'N/A',
    },
    {
      title: 'Author',
      key: 'author',
      render: (_, record) => (
        <span>
          {record.author?.firstName} {record.author?.lastName}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'editor_status',
      key: 'editor_status',
      render: (status) => {
        let color = 'orange';
        if (status === 'Accepted by Editor') color = 'green';
        if (status === 'Rejected by Editor') color = 'red';
        return (
          <Tag color={color}>
            {status || 'Pending Review'}
          </Tag>
        );
      },
    },
    {
      title: 'Assigned Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => moment(date).format('DD MMM, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<FaEye />}
          onClick={() => navigate(`/dashboard/editor/manuscripts/${record.manuscript_id}`)}
          className="bg-[#12b48b] border-[#12b48b] hover:bg-[#0e9470]"
        >
          Review
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading assigned manuscripts..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card
        title={
          <span className="text-[#204066] font-semibold text-lg">
            Assigned Manuscripts for Review
          </span>
        }
        className="shadow-sm"
      >
        {manuscripts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg text-center">No manuscripts assigned to you yet.</p>
          </div>
        ) : (
          <Table
            dataSource={manuscripts}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default EditorManuscriptList;
