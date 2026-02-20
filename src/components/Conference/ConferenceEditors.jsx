import React, { useState, useEffect } from 'react';
import { Tag, message, Spin, Empty, Avatar, Tooltip, Switch, Modal } from 'antd';
import { UserOutlined, CrownOutlined, TeamOutlined, MailOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { editorConferenceApi } from '../../services/api';

/**
 * ConferenceEditors Component
 * 
 * Displays all editors assigned to a specific conference
 * Compact card layout for sidebar display with active/inactive toggle
 * 
 * @param {number} conferenceId - The conference ID to fetch editors for
 */
const ConferenceEditors = ({ conferenceId }) => {
    const [editors, setEditors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ visible: false, editor: null, newStatus: false });
    const [updating, setUpdating] = useState(null); // Track which editor is being updated

    useEffect(() => {
        if (conferenceId) {
            fetchEditors();
        }
    }, [conferenceId]);

    const fetchEditors = async () => {
        setLoading(true);
        try {
            const response = await editorConferenceApi.getEditorsByConference(conferenceId);
            const editorsData = response.data?.success || [];
            setEditors(editorsData);
        } catch (error) {
            console.error('Error fetching editors:', error);
            message.error('Failed to load editors');
        } finally {
            setLoading(false);
        }
    };

    const getRoleConfig = (role) => {
        const configs = {
            'organizer': { color: 'gold', icon: <CrownOutlined />, label: 'Organizer' },
            'co-organizer': { color: 'blue', icon: <TeamOutlined />, label: 'Co-Organizer' },
            'reviewer': { color: 'green', icon: <UserOutlined />, label: 'Reviewer' }
        };
        return configs[role] || { color: 'default', icon: <UserOutlined />, label: role };
    };

    const getDisplayName = (editor) => {
        const { firstName, lastName } = editor;
        if (!firstName || firstName === 'Not Mentioned') {
            return null;
        }
        return `${firstName} ${lastName}`;
    };

    const handleToggleClick = (record, checked) => {
        const editorName = getDisplayName(record.editor) || record.editor.email;
        setConfirmModal({
            visible: true,
            editor: record,
            newStatus: checked,
            editorName
        });
    };

    const handleConfirmToggle = async () => {
        const { editor, newStatus } = confirmModal;
        setConfirmModal({ visible: false, editor: null, newStatus: false });
        setUpdating(editor.id);

        try {
            await editorConferenceApi.updateEditorRole(conferenceId, editor.editor_id, {
                is_active: newStatus
            });

            // Update local state
            setEditors(prev => prev.map(e =>
                e.id === editor.id ? { ...e, is_active: newStatus } : e
            ));

            message.success(`Editor ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Error updating editor status:', error);
            message.error('Failed to update editor status');
        } finally {
            setUpdating(null);
        }
    };

    const handleCancelToggle = () => {
        setConfirmModal({ visible: false, editor: null, newStatus: false });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin size="small" />
            </div>
        );
    }

    if (!editors || editors.length === 0) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 40 }}
                description={<span style={{ fontSize: 12, color: '#999' }}>No editors assigned</span>}
            />
        );
    }

    return (
        <>
            <div className="conference-editors-list">
                {editors.map((record, index) => {
                    const roleConfig = getRoleConfig(record.role);
                    const displayName = getDisplayName(record.editor);
                    const isActive = record.is_active !== false; // Default to true if undefined
                    const isUpdating = updating === record.id;

                    return (
                        <div
                            key={record.id || index}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: !isActive ? '#fef2f2' : (record.is_primary ? '#fffbeb' : '#f9fafb'),
                                border: !isActive ? '1px solid #fecaca' : (record.is_primary ? '1px solid #fcd34d' : '1px solid #e5e7eb'),
                                marginBottom: index < editors.length - 1 ? '10px' : 0,
                                opacity: !isActive ? 0.7 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {/* Header: Avatar + Name/Email + Toggle */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Avatar
                                    size={36}
                                    icon={<UserOutlined />}
                                    style={{
                                        backgroundColor: !isActive ? '#9ca3af' : (record.is_primary ? '#f59e0b' : '#6366f1'),
                                        flexShrink: 0
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Name or Email */}
                                    {displayName ? (
                                        <>
                                            <div style={{
                                                fontWeight: 600,
                                                fontSize: 14,
                                                color: !isActive ? '#9ca3af' : '#1f2937',
                                                textDecoration: !isActive ? 'line-through' : 'none'
                                            }}>
                                                {displayName}
                                            </div>
                                            <Tooltip title={record.editor.email}>
                                                <div style={{
                                                    fontSize: 12,
                                                    color: '#6b7280',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    <MailOutlined style={{ marginRight: 4 }} />
                                                    {record.editor.email}
                                                </div>
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <Tooltip title={record.editor.email}>
                                            <div style={{
                                                fontWeight: 600,
                                                fontSize: 13,
                                                color: !isActive ? '#9ca3af' : '#1f2937',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                textDecoration: !isActive ? 'line-through' : 'none'
                                            }}>
                                                {record.editor.email}
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>

                                {/* Active Toggle */}
                                <Tooltip title={isActive ? 'Click to deactivate' : 'Click to activate'}>
                                    <Switch
                                        size="small"
                                        checked={isActive}
                                        loading={isUpdating}
                                        onChange={(checked) => handleToggleClick(record, checked)}
                                        style={{
                                            marginTop: 4,
                                            backgroundColor: isActive ? '#22c55e' : '#d1d5db'
                                        }}
                                    />
                                </Tooltip>
                            </div>

                            {/* Tags Row */}
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                                {/* Role Tag */}
                                <Tag
                                    color={!isActive ? 'default' : roleConfig.color}
                                    icon={roleConfig.icon}
                                    style={{ margin: 0, fontSize: 11 }}
                                >
                                    {roleConfig.label}
                                </Tag>

                                {/* Inactive Badge */}
                                {!isActive && (
                                    <Tag color="error" style={{ margin: 0, fontSize: 11 }}>
                                        Inactive
                                    </Tag>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ExclamationCircleOutlined style={{ color: confirmModal.newStatus ? '#22c55e' : '#f59e0b', fontSize: 20 }} />
                        <span>{confirmModal.newStatus ? 'Activate Editor' : 'Deactivate Editor'}</span>
                    </div>
                }
                open={confirmModal.visible}
                onOk={handleConfirmToggle}
                onCancel={handleCancelToggle}
                okText={confirmModal.newStatus ? 'Yes, Activate' : 'Yes, Deactivate'}
                cancelText="Cancel"
                okButtonProps={{
                    danger: !confirmModal.newStatus,
                    style: confirmModal.newStatus ? { backgroundColor: '#22c55e', borderColor: '#22c55e' } : {}
                }}
                centered
            >
                <p style={{ fontSize: 14, margin: '16px 0' }}>
                    {confirmModal.newStatus ? (
                        <>
                            Are you sure you want to <strong>activate</strong> <strong>{confirmModal.editorName}</strong>?
                            <br /><br />
                            <span style={{ color: '#6b7280' }}>
                                This editor will be able to receive abstract assignments for this conference.
                            </span>
                        </>
                    ) : (
                        <>
                            Are you sure you want to <strong>deactivate</strong> <strong>{confirmModal.editorName}</strong>?
                            <br /><br />
                            <span style={{ color: '#6b7280' }}>
                                This editor will no longer appear in the conference editor dropdown and won't receive new abstract assignments.
                            </span>
                        </>
                    )}
                </p>
            </Modal>
        </>
    );
};

export default ConferenceEditors;
