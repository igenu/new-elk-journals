// Mock API for conference submitted abstracts management
// TODO: Replace with real API endpoints when backend is ready
//
// Status Flow:
//   Submitted → Assigned to Editor → Reviewed by Editor
//   → Assigned to Conference Editor → Reviewed by Conference Editor
//   → Accepted (Final)
//   ❌ Rejected can occur at any stage and stops the process immediately

const mockEditors = [
    { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@university.edu', specialization: 'Computer Science' },
    { id: 2, name: 'Dr. Priya Sharma', email: 'priya.sharma@institute.ac.in', specialization: 'Data Science' },
    { id: 3, name: 'Dr. Amit Patel', email: 'amit.patel@research.org', specialization: 'Machine Learning' },
    { id: 4, name: 'Dr. Sneha Reddy', email: 'sneha.reddy@college.edu', specialization: 'Healthcare IT' },
    { id: 5, name: 'Dr. Vikram Singh', email: 'vikram.singh@tech.edu', specialization: 'Blockchain' },
];

const mockAbstracts = [
    {
        id: 1,
        conference_id: 1,
        conference: { id: 1, name: 'International Conference on AI & ML 2025' },
        author: { firstName: 'John', lastName: 'Smith', email: 'john.smith@mit.edu', id: 101 },
        abstract_file: 'abstracts/abstract_ai_ml_001.pdf',
        title: 'Deep Learning Approaches for Natural Language Understanding',
        status: 'Submitted',
        assigned_editor: null,
        assigned_by: null,
        editor_comment: null,
        assigned_conference_editor: null,
        conference_editor_assigned_by: null,
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-10T10:30:00.000Z',
    },
    {
        id: 2,
        conference_id: 1,
        conference: { id: 1, name: 'International Conference on AI & ML 2025' },
        author: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@harvard.edu', id: 102 },
        abstract_file: 'abstracts/abstract_ai_ml_002.pdf',
        title: 'Reinforcement Learning in Autonomous Systems',
        status: 'Assigned to Editor',
        assigned_editor: { id: 2, name: 'Dr. Priya Sharma' },
        assigned_by: { name: 'Admin User' },
        editor_comment: null,
        assigned_conference_editor: null,
        conference_editor_assigned_by: null,
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-12T14:20:00.000Z',
    },
    {
        id: 3,
        conference_id: 1,
        conference: { id: 1, name: 'International Conference on AI & ML 2025' },
        author: { firstName: 'Michael', lastName: 'Chen', email: 'm.chen@oxford.ac.uk', id: 103 },
        abstract_file: 'abstracts/abstract_ai_ml_003.pdf',
        title: 'Federated Learning for Privacy-Preserving Healthcare Analytics',
        status: 'Reviewed by Editor',
        assigned_editor: { id: 2, name: 'Dr. Priya Sharma' },
        assigned_by: { name: 'Admin User' },
        editor_comment: 'Well-structured abstract with clear methodology. Recommended for next stage.',
        assigned_conference_editor: null,
        conference_editor_assigned_by: null,
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-15T09:15:00.000Z',
    },
    {
        id: 4,
        conference_id: 2,
        conference: { id: 2, name: 'Global Blockchain Summit 2025' },
        author: { firstName: 'Emma', lastName: 'Williams', email: 'e.williams@cambridge.ac.uk', id: 104 },
        abstract_file: 'abstracts/abstract_blockchain_001.pdf',
        title: 'Decentralized Identity Management Using Blockchain',
        status: 'Submitted',
        assigned_editor: null,
        assigned_by: null,
        editor_comment: null,
        assigned_conference_editor: null,
        conference_editor_assigned_by: null,
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-08T11:00:00.000Z',
    },
    {
        id: 5,
        conference_id: 2,
        conference: { id: 2, name: 'Global Blockchain Summit 2025' },
        author: { firstName: 'David', lastName: 'Lee', email: 'd.lee@imperial.ac.uk', id: 105 },
        abstract_file: 'abstracts/abstract_blockchain_002.pdf',
        title: 'Smart Contract Security Audit Framework',
        status: 'Assigned to Conference Editor',
        assigned_editor: { id: 5, name: 'Dr. Vikram Singh' },
        assigned_by: { name: 'Admin User' },
        editor_comment: 'Solid research direction. The audit framework is novel and relevant.',
        assigned_conference_editor: { id: 3, name: 'Dr. Amit Patel' },
        conference_editor_assigned_by: { name: 'Admin User' },
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-11T16:45:00.000Z',
    },
    {
        id: 6,
        conference_id: 1,
        conference: { id: 1, name: 'International Conference on AI & ML 2025' },
        author: { firstName: 'Anita', lastName: 'Gupta', email: 'anita.g@iitd.ac.in', id: 106 },
        abstract_file: 'abstracts/abstract_ai_ml_004.pdf',
        title: 'Transformer Models for Low-Resource Language Translation',
        status: 'Assigned to Editor',
        assigned_editor: { id: 2, name: 'Dr. Priya Sharma' },
        assigned_by: { name: 'Admin User' },
        editor_comment: null,
        assigned_conference_editor: null,
        conference_editor_assigned_by: null,
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-18T08:30:00.000Z',
    },
    {
        id: 7,
        conference_id: 2,
        conference: { id: 2, name: 'Global Blockchain Summit 2025' },
        author: { firstName: 'Ravi', lastName: 'Mehta', email: 'ravi.m@iisc.ac.in', id: 107 },
        abstract_file: 'abstracts/abstract_blockchain_003.pdf',
        title: 'Consensus Mechanisms for Energy-Efficient Blockchains',
        status: 'Assigned to Editor',
        assigned_editor: { id: 5, name: 'Dr. Vikram Singh' },
        assigned_by: { name: 'Admin User' },
        editor_comment: null,
        assigned_conference_editor: null,
        conference_editor_assigned_by: null,
        conference_editor_comment: null,
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-20T10:00:00.000Z',
    },
    {
        id: 8,
        conference_id: 1,
        conference: { id: 1, name: 'International Conference on AI & ML 2025' },
        author: { firstName: 'Lisa', lastName: 'Wang', email: 'lisa.w@tsinghua.edu.cn', id: 108 },
        abstract_file: 'abstracts/abstract_ai_ml_005.pdf',
        title: 'Graph Neural Networks for Drug Discovery',
        status: 'Reviewed by Conference Editor',
        assigned_editor: { id: 1, name: 'Dr. Rajesh Kumar' },
        assigned_by: { name: 'Admin User' },
        editor_comment: 'Excellent abstract with innovative approach to drug discovery.',
        assigned_conference_editor: { id: 2, name: 'Dr. Priya Sharma' },
        conference_editor_assigned_by: { name: 'Admin User' },
        conference_editor_comment: 'Thorough methodology and strong results. Recommend acceptance.',
        admin_final_comment: null,
        full_paper_files: null,
        createdAt: '2025-01-05T07:30:00.000Z',
    },
    {
        id: 9,
        conference_id: 1,
        conference: { id: 1, name: 'International Conference on AI & ML 2025' },
        author: { firstName: 'John', lastName: 'Smith', email: 'john.smith@mit.edu', id: 101 },
        abstract_file: 'abstracts/abstract_ai_ml_006.pdf',
        title: 'Attention Mechanisms in Vision Transformers',
        status: 'Accepted',
        assigned_editor: { id: 1, name: 'Dr. Rajesh Kumar' },
        assigned_by: { name: 'Admin User' },
        editor_comment: 'Strong contribution to the vision transformer field.',
        assigned_conference_editor: { id: 2, name: 'Dr. Priya Sharma' },
        conference_editor_assigned_by: { name: 'Admin User' },
        conference_editor_comment: 'Excellent methodology and results. Highly recommended.',
        admin_final_comment: 'Accepted for full paper submission.',
        full_paper_files: null,
        createdAt: '2025-01-02T08:00:00.000Z',
    },
    {
        id: 10,
        conference_id: 2,
        conference: { id: 2, name: 'Global Blockchain Summit 2025' },
        author: { firstName: 'John', lastName: 'Smith', email: 'john.smith@mit.edu', id: 101 },
        abstract_file: 'abstracts/abstract_blockchain_004.pdf',
        title: 'Zero-Knowledge Proofs for Scalable Blockchain Networks',
        status: 'Accepted',
        assigned_editor: { id: 5, name: 'Dr. Vikram Singh' },
        assigned_by: { name: 'Admin User' },
        editor_comment: 'Innovative ZK-proof approach with practical applications.',
        assigned_conference_editor: { id: 3, name: 'Dr. Amit Patel' },
        conference_editor_assigned_by: { name: 'Admin User' },
        conference_editor_comment: 'Well-structured and addresses key scalability challenges.',
        admin_final_comment: 'Accepted. Proceed to full paper.',
        full_paper_files: [
            {
                id: 1,
                file_name: 'ZK_Proofs_Full_Paper.pdf',
                file_type: 'application/pdf',
                file_path: 'full_papers/zk_proofs_full_paper.pdf',
                uploaded_at: '2025-01-25T14:30:00.000Z',
                uploaded_by: { firstName: 'John', lastName: 'Smith' },
            }
        ],
        createdAt: '2025-01-03T10:15:00.000Z',
    },
];

// Internal mutable state to support assignment and review updates during the session
let abstractsState = JSON.parse(JSON.stringify(mockAbstracts));

/**
 * Mock API service for Admin abstract management
 *
 * When replacing with real API, use:
 * abstractSubmissionApi.getByConference(conferenceId)
 * abstractSubmissionApi.assignEditor(abstractId, editorId)
 * abstractSubmissionApi.assignConferenceEditor(abstractId, editorId)
 * abstractSubmissionApi.adminFinalDecision(abstractId, { action, comment })
 */
export const mockAbstractManagementApi = {
    /**
     * Get all abstracts submitted for a specific conference
     */
    getByConference: (conferenceId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtered = abstractsState.filter(
                    (a) => String(a.conference_id) === String(conferenceId)
                );
                resolve({
                    data: {
                        success: true,
                        data: filtered,
                        message: 'Abstracts fetched successfully',
                    },
                });
            }, 500);
        });
    },

    /**
     * Get list of available editors for assignment
     */
    getEditors: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        success: true,
                        data: mockEditors,
                        message: 'Editors fetched successfully',
                    },
                });
            }, 300);
        });
    },

    /**
     * Assign an abstract to an editor (Stage 1)
     * Requires status: "Submitted"
     */
    assignEditor: (abstractId, editorId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = abstractsState.findIndex((a) => a.id === abstractId);
                const editor = mockEditors.find((e) => e.id === editorId);

                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }
                if (!editor) {
                    reject({ response: { data: { message: 'Editor not found' } } });
                    return;
                }

                abstractsState[index] = {
                    ...abstractsState[index],
                    status: 'Assigned to Editor',
                    assigned_editor: { id: editor.id, name: editor.name },
                    assigned_by: { name: 'Admin User' },
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: 'Abstract assigned to editor successfully',
                    },
                });
            }, 500);
        });
    },

    /**
     * Assign an abstract to a conference editor (Stage 2)
     * Requires status: "Reviewed by Editor"
     */
    assignConferenceEditor: (abstractId, editorId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = abstractsState.findIndex((a) => a.id === abstractId);
                const editor = mockEditors.find((e) => e.id === editorId);

                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }
                if (!editor) {
                    reject({ response: { data: { message: 'Editor not found' } } });
                    return;
                }
                if (abstractsState[index].status !== 'Reviewed by Editor') {
                    reject({ response: { data: { message: 'Abstract must be reviewed by editor first' } } });
                    return;
                }

                abstractsState[index] = {
                    ...abstractsState[index],
                    status: 'Assigned to Conference Editor',
                    assigned_conference_editor: { id: editor.id, name: editor.name },
                    conference_editor_assigned_by: { name: 'Admin User' },
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: 'Abstract assigned to conference editor successfully',
                    },
                });
            }, 500);
        });
    },

    /**
     * Admin final decision on abstract (Stage 3 - Final)
     * Requires status: "Reviewed by Conference Editor"
     * @param {number} abstractId
     * @param {string} action - 'accept' or 'reject'
     * @param {string} comment - Admin comment (mandatory for reject)
     */
    adminFinalDecision: (abstractId, action, comment) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = abstractsState.findIndex((a) => a.id === abstractId);

                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }
                if (abstractsState[index].status !== 'Reviewed by Conference Editor') {
                    reject({ response: { data: { message: 'Abstract must be reviewed by conference editor first' } } });
                    return;
                }
                if (action === 'reject' && (!comment || !comment.trim())) {
                    reject({ response: { data: { message: 'Comment is required for rejection' } } });
                    return;
                }

                const newStatus = action === 'accept' ? 'Accepted' : 'Rejected';
                abstractsState[index] = {
                    ...abstractsState[index],
                    status: newStatus,
                    admin_final_comment: comment ? comment.trim() : null,
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: `Abstract ${newStatus.toLowerCase()} successfully`,
                    },
                });
            }, 500);
        });
    },

    /**
     * Admin rejects abstract at any stage
     * @param {number} abstractId
     * @param {string} comment - Mandatory rejection comment
     */
    adminReject: (abstractId, comment) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!comment || !comment.trim()) {
                    reject({ response: { data: { message: 'Comment is required for rejection' } } });
                    return;
                }
                const index = abstractsState.findIndex((a) => a.id === abstractId);
                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }

                abstractsState[index] = {
                    ...abstractsState[index],
                    status: 'Rejected',
                    admin_final_comment: comment.trim(),
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: 'Abstract rejected successfully',
                    },
                });
            }, 500);
        });
    },
};

/**
 * Mock API service for editor abstract review (both Editor and Conference Editor)
 *
 * When replacing with real API, use:
 * abstractSubmissionApi.getByEditor(editorId)
 * abstractSubmissionApi.reviewAbstract(abstractId, { action, comment })
 */
export const mockEditorReviewApi = {
    /**
     * Get all abstracts assigned to a specific editor
     * Returns abstracts where the editor is either assigned_editor (stage 1)
     * or assigned_conference_editor (stage 2)
     */
    getAssignedAbstracts: (editorId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtered = abstractsState.filter((a) => {
                    const isEditor =
                        a.assigned_editor &&
                        a.assigned_editor.id === editorId &&
                        (a.status === 'Assigned to Editor' || a.status === 'Reviewed by Editor');
                    const isConferenceEditor =
                        a.assigned_conference_editor &&
                        a.assigned_conference_editor.id === editorId &&
                        (a.status === 'Assigned to Conference Editor' || a.status === 'Reviewed by Conference Editor');
                    return isEditor || isConferenceEditor;
                });
                resolve({
                    data: {
                        success: true,
                        data: filtered,
                        message: 'Assigned abstracts fetched successfully',
                    },
                });
            }, 500);
        });
    },

    /**
     * Accept an abstract (Editor or Conference Editor action)
     * - If status is "Assigned to Editor" → becomes "Reviewed by Editor"
     * - If status is "Assigned to Conference Editor" → becomes "Reviewed by Conference Editor"
     */
    acceptAbstract: (abstractId, comment) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!comment || !comment.trim()) {
                    reject({ response: { data: { message: 'Comment is required' } } });
                    return;
                }

                const index = abstractsState.findIndex((a) => a.id === abstractId);
                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }

                const current = abstractsState[index];
                let newStatus;
                let commentField;

                if (current.status === 'Assigned to Editor') {
                    newStatus = 'Reviewed by Editor';
                    commentField = 'editor_comment';
                } else if (current.status === 'Assigned to Conference Editor') {
                    newStatus = 'Reviewed by Conference Editor';
                    commentField = 'conference_editor_comment';
                } else {
                    reject({ response: { data: { message: 'Abstract is not in a reviewable state' } } });
                    return;
                }

                abstractsState[index] = {
                    ...abstractsState[index],
                    status: newStatus,
                    [commentField]: comment.trim(),
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: 'Abstract accepted successfully',
                    },
                });
            }, 500);
        });
    },

    /**
     * Reject an abstract (Editor or Conference Editor action)
     * Sets status to "Rejected" regardless of current stage
     */
    rejectAbstract: (abstractId, comment) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!comment || !comment.trim()) {
                    reject({ response: { data: { message: 'Comment is required' } } });
                    return;
                }

                const index = abstractsState.findIndex((a) => a.id === abstractId);
                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }

                const current = abstractsState[index];
                let commentField;
                if (current.status === 'Assigned to Editor') {
                    commentField = 'editor_comment';
                } else if (current.status === 'Assigned to Conference Editor') {
                    commentField = 'conference_editor_comment';
                } else {
                    reject({ response: { data: { message: 'Abstract is not in a reviewable state' } } });
                    return;
                }

                abstractsState[index] = {
                    ...abstractsState[index],
                    status: 'Rejected',
                    [commentField]: comment.trim(),
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: 'Abstract rejected successfully',
                    },
                });
            }, 500);
        });
    },
};

/**
 * Mock API service for Author full paper submission
 *
 * When replacing with real API, use:
 * abstractSubmissionApi.getAcceptedByAuthor(authorId)
 * abstractSubmissionApi.submitFullPaper(abstractId, formData)
 */
export const mockAuthorFullPaperApi = {
    /**
     * Get all accepted abstracts for a specific author (eligible for full paper submission)
     */
    getAcceptedAbstracts: (authorId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtered = abstractsState.filter(
                    (a) => a.author?.id === authorId && a.status === 'Accepted'
                );
                resolve({
                    data: {
                        success: true,
                        data: filtered,
                        message: 'Accepted abstracts fetched successfully',
                    },
                });
            }, 500);
        });
    },

    /**
     * Submit full paper file(s) for an accepted abstract
     * @param {number} abstractId
     * @param {Array} files - Array of file objects { file_name, file_type, file_path }
     */
    submitFullPaper: (abstractId, files) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = abstractsState.findIndex((a) => a.id === abstractId);
                if (index === -1) {
                    reject({ response: { data: { message: 'Abstract not found' } } });
                    return;
                }
                if (abstractsState[index].status !== 'Accepted') {
                    reject({ response: { data: { message: 'Only accepted abstracts are eligible for full paper submission' } } });
                    return;
                }
                if (!files || files.length === 0) {
                    reject({ response: { data: { message: 'At least one file is required' } } });
                    return;
                }

                const author = abstractsState[index].author;
                const fullPaperFiles = files.map((f, i) => ({
                    id: Date.now() + i,
                    file_name: f.file_name || f.name,
                    file_type: f.file_type || f.type,
                    file_path: `full_papers/${f.file_name || f.name}`,
                    uploaded_at: new Date().toISOString(),
                    uploaded_by: { firstName: author.firstName, lastName: author.lastName },
                }));

                abstractsState[index] = {
                    ...abstractsState[index],
                    full_paper_files: [
                        ...(abstractsState[index].full_paper_files || []),
                        ...fullPaperFiles,
                    ],
                };

                resolve({
                    data: {
                        success: true,
                        data: abstractsState[index],
                        message: 'Full paper submitted successfully',
                    },
                });
            }, 800);
        });
    },
};

export default mockAbstractManagementApi;
