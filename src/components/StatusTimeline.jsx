import React from 'react';
import { Timeline, Card, Typography, Tag } from 'antd';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserEdit,
  FaUserTie,
  FaUser,
  FaPaperPlane,
  FaUserCheck,
} from 'react-icons/fa';
import moment from 'moment';

const { Text } = Typography;

const StatusTimeline = ({ manuscript }) => {
  if (!manuscript) return null;

  // Build timeline from existing manuscript data
  const buildTimeline = () => {
    const timeline = [];

    // 1. Submission (always present)
    timeline.push({
      status: 'Pending',
      label: 'Manuscript Submitted',
      comment: 'Manuscript submitted successfully',
      updatedBy: 'Author',
      timestamp: manuscript.createdAt,
      icon: <FaPaperPlane className="text-yellow-500" />,
      color: 'gold',
    });

    // 2. If assigned to editor
    if (manuscript.assigned_editor_id && manuscript.assignedEditor) {
      const editorName = manuscript.assignedEditor?.name ||
        `${manuscript.assignedEditor?.firstName || ''} ${manuscript.assignedEditor?.lastName || ''}`.trim();
      timeline.push({
        status: 'Assigned to Editor',
        label: 'Assigned to Editor',
        comment: `Assigned to: ${editorName}`,
        updatedBy: 'Admin',
        timestamp: manuscript.updatedAt,
        icon: <FaUserCheck className="text-blue-500" />,
        color: 'blue',
      });
    }

    // 3. If editor reviewed
    if (manuscript.editor_status && manuscript.editor_status !== 'Pending Review') {
      const isAccepted = manuscript.editor_status === 'Accepted by Editor';
      timeline.push({
        status: manuscript.editor_status,
        label: isAccepted ? 'Editor Accepted' : 'Editor Rejected',
        comment: manuscript.editor_comment || (isAccepted ? 'Manuscript accepted by editor' : 'Manuscript rejected by editor'),
        updatedBy: 'Editor',
        timestamp: manuscript.editor_reviewed_at || manuscript.updatedAt,
        icon: isAccepted ? <FaCheckCircle className="text-cyan-500" /> : <FaTimesCircle className="text-red-500" />,
        color: isAccepted ? 'cyan' : 'red',
      });
    }

    // 4. If admin made final decision
    if (manuscript.admin_final_decision) {
      const isAccepted = manuscript.admin_final_decision === 'Accepted';
      timeline.push({
        status: manuscript.admin_final_decision,
        label: `Final Decision: ${manuscript.admin_final_decision}`,
        comment: manuscript.admin_final_comment || `Manuscript ${isAccepted ? 'accepted' : 'rejected'} by admin`,
        updatedBy: 'Admin',
        timestamp: manuscript.updatedAt,
        icon: isAccepted ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />,
        color: isAccepted ? 'green' : 'red',
      });
    }
    // If status is Rejected but no admin_final_decision (rejected by editor)
    else if (manuscript.status === 'Rejected' && manuscript.editor_status === 'Rejected by Editor') {
      // Already handled in editor section
    }
    // If final status is different from last timeline entry and not covered
    else if (manuscript.status !== 'Pending' &&
             manuscript.status !== 'Assigned to Editor' &&
             manuscript.status !== 'Accepted by Editor' &&
             !timeline.some(t => t.status === manuscript.status)) {
      const isAccepted = manuscript.status === 'Accepted';
      const isRejected = manuscript.status === 'Rejected';
      timeline.push({
        status: manuscript.status,
        label: manuscript.status,
        comment: manuscript.comment || `Status updated to ${manuscript.status}`,
        updatedBy: 'Admin',
        timestamp: manuscript.updatedAt,
        icon: isAccepted ? <FaCheckCircle className="text-green-500" /> :
              isRejected ? <FaTimesCircle className="text-red-500" /> :
              <FaClock className="text-blue-500" />,
        color: isAccepted ? 'green' : isRejected ? 'red' : 'processing',
      });
    }

    return timeline;
  };

  const timelineItems = buildTimeline();

  // Get updatedBy icon
  const getUpdatedByIcon = (updatedBy) => {
    const lower = updatedBy?.toLowerCase();
    if (lower === 'admin') return <FaUserTie className="text-purple-500" />;
    if (lower === 'editor') return <FaUserEdit className="text-blue-500" />;
    return <FaUser className="text-green-500" />;
  };

  return (
    <Card
      title={
        <span className="text-[#204066] font-semibold flex items-center gap-2">
          <FaClock /> Status Timeline
        </span>
      }
      className="shadow-sm border-0 mb-6 rounded-lg"
    >
      <Timeline
        items={timelineItems.map((item, index) => ({
          dot: item.icon,
          color: item.color,
          children: (
            <div className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag color={item.color} className="m-0 font-medium">
                  {item.label}
                </Tag>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  {getUpdatedByIcon(item.updatedBy)}
                  <span>{item.updatedBy}</span>
                </span>
              </div>
              {item.comment && (
                <Text className="block text-sm text-gray-600 mt-1">
                  {item.comment}
                </Text>
              )}
              <Text type="secondary" className="block text-xs mt-1">
                {moment(item.timestamp).format('DD MMM YYYY, hh:mm A')}
              </Text>
            </div>
          ),
        }))}
      />
    </Card>
  );
};

export default StatusTimeline;
