// Mock API for manuscripts awaiting copyright
// TODO: Replace with real API endpoint when backend is ready
// Data structure matches the actual manuscript submission form and database schema

export const mockAwaitingCopyrightManuscripts = [
    {
        id: 101,
        manuscript_id: "MS-2024-0042",
        paper_title: "Machine Learning Approaches for Climate Prediction Using Deep Neural Networks",
        manuscript_type: "Research Article",

        // Submitter Info
        submitter_name: "Dr. John Smith",
        submitter_email: "john.smith@mit.edu",
        submitter_phone: "1234567890",

        // Status
        status: "Awaiting Copyright",

        // Journal
        journal_id: 5,
        journal: {
            id: 5,
            title: "International Journal of Computer Science",
            print_issn: "1234-5678",
            e_issn: "9876-5432"
        },

        // Content
        abstract: "This paper presents a novel approach to climate prediction using deep neural networks. We propose a hybrid model combining LSTM and Transformer architectures that achieves state-of-the-art results on multiple benchmark datasets. Our model demonstrates significant improvements in prediction accuracy while maintaining computational efficiency.",
        keywords: "machine learning, climate prediction, neural networks, LSTM, transformer",

        // Manuscript Stats
        word_count: 5500,
        page_count: 12,
        table_count: 3,
        figure_count: 5,
        no_of_words_text: "5,500 words approximately",

        // File paths (stored in backend)
        manuscript_file_path: "/uploads/manuscripts/ms-2024-0042.pdf",
        cover_letter_path: "/uploads/cover-letters/cl-2024-0042.pdf",
        signature_file_path: "/uploads/signatures/sig-2024-0042.png",

        // Authors (matching actual form structure)
        authors: [
            {
                id: 1,
                first_name: "John",
                last_name: "Smith",
                email: "john.smith@mit.edu",
                phone: "1234567890",
                institution: "Massachusetts Institute of Technology",
                department: "Computer Science",
                country: "United States",
                state: "Massachusetts",
                city: "Cambridge",
                address: "77 Massachusetts Avenue",
                is_corresponding_author: true
            },
            {
                id: 2,
                first_name: "Jane",
                last_name: "Doe",
                email: "jane.doe@stanford.edu",
                phone: "9876543210",
                institution: "Stanford University",
                department: "Electrical Engineering",
                country: "United States",
                state: "California",
                city: "Stanford",
                address: "450 Serra Mall",
                is_corresponding_author: false
            }
        ],

        // Suggested Reviewer
        reviewer_first_name: "Michael",
        reviewer_last_name: "Johnson",
        reviewer_email: "m.johnson@berkeley.edu",
        reviewer_phone: "5551234567",
        reviewer_institution: "UC Berkeley",
        reviewer_department: "Data Science",
        reviewer_specialisation: "Deep Learning",
        reviewer_city: "Berkeley",
        reviewer_country: "United States",

        // Submission Checklist (from the form)
        checklist: {
            is_sole_submission: true,
            is_not_published: true,
            is_original_work: true,
            has_declared_conflicts: true,
            has_acknowledged_support: true,
            has_acknowledged_funding: true,
            follows_guidelines: true
        },

        // Timestamps
        createdAt: "2024-11-15T10:30:00.000Z",
        updatedAt: "2024-12-20T14:00:00.000Z"
    },
    {
        id: 102,
        manuscript_id: "MS-2024-0056",
        paper_title: "Blockchain-Based Healthcare Data Management: A Comprehensive Framework",
        manuscript_type: "Review Article",

        submitter_name: "Dr. Sarah Johnson",
        submitter_email: "sarah.johnson@harvard.edu",
        submitter_phone: "5559876543",

        status: "Awaiting Copyright",

        journal_id: 8,
        journal: {
            id: 8,
            title: "Journal of Healthcare Technology",
            print_issn: "2345-6789",
            e_issn: "8765-4321"
        },

        abstract: "This research explores the implementation of blockchain technology for secure and transparent healthcare data management. We propose a decentralized framework that ensures data integrity, patient privacy, and seamless interoperability between healthcare providers.",
        keywords: "blockchain, healthcare, data management, security, privacy, interoperability",

        word_count: 7200,
        page_count: 18,
        table_count: 5,
        figure_count: 8,
        no_of_words_text: "7,200 words approximately",

        manuscript_file_path: "/uploads/manuscripts/ms-2024-0056.pdf",
        cover_letter_path: "/uploads/cover-letters/cl-2024-0056.pdf",
        signature_file_path: "/uploads/signatures/sig-2024-0056.png",

        authors: [
            {
                id: 3,
                first_name: "Sarah",
                last_name: "Johnson",
                email: "sarah.johnson@harvard.edu",
                phone: "5559876543",
                institution: "Harvard University",
                department: "Health Informatics",
                country: "United States",
                state: "Massachusetts",
                city: "Boston",
                address: "25 Shattuck Street",
                is_corresponding_author: true
            }
        ],

        reviewer_first_name: "Emily",
        reviewer_last_name: "Brown",
        reviewer_email: "e.brown@yale.edu",
        reviewer_phone: "5552345678",
        reviewer_institution: "Yale University",
        reviewer_department: "Biomedical Informatics",
        reviewer_specialisation: "Healthcare Systems",
        reviewer_city: "New Haven",
        reviewer_country: "United States",

        checklist: {
            is_sole_submission: true,
            is_not_published: true,
            is_original_work: true,
            has_declared_conflicts: true,
            has_acknowledged_support: true,
            has_acknowledged_funding: true,
            follows_guidelines: true
        },

        createdAt: "2024-12-01T14:20:00.000Z",
        updatedAt: "2024-12-22T09:30:00.000Z"
    },
    {
        id: 103,
        manuscript_id: "MS-2024-0078",
        paper_title: "Quantum Computing Applications in Modern Cryptography",
        manuscript_type: "Research Article",

        submitter_name: "Dr. Michael Chen",
        submitter_email: "m.chen@oxford.ac.uk",
        submitter_phone: "441onal865123456",

        status: "Awaiting Copyright",

        journal_id: 5,
        journal: {
            id: 5,
            title: "International Journal of Computer Science",
            print_issn: "1234-5678",
            e_issn: "9876-5432"
        },

        abstract: "We investigate the potential of quantum computing for next-generation cryptographic systems. This paper presents quantum-resistant algorithms and analyzes their performance characteristics compared to classical encryption methods. Our findings suggest quantum computing will fundamentally transform data security practices.",
        keywords: "quantum computing, cryptography, security, qubits, encryption, post-quantum",

        word_count: 6800,
        page_count: 15,
        table_count: 4,
        figure_count: 6,
        no_of_words_text: "6,800 words approximately",

        manuscript_file_path: "/uploads/manuscripts/ms-2024-0078.pdf",
        cover_letter_path: "/uploads/cover-letters/cl-2024-0078.pdf",
        signature_file_path: "/uploads/signatures/sig-2024-0078.png",

        authors: [
            {
                id: 4,
                first_name: "Michael",
                last_name: "Chen",
                email: "m.chen@oxford.ac.uk",
                phone: "441865123456",
                institution: "Oxford University",
                department: "Physics",
                country: "United Kingdom",
                state: "Oxfordshire",
                city: "Oxford",
                address: "Parks Road",
                is_corresponding_author: true
            },
            {
                id: 5,
                first_name: "Emma",
                last_name: "Williams",
                email: "e.williams@cambridge.ac.uk",
                phone: "441223456789",
                institution: "Cambridge University",
                department: "Computer Science",
                country: "United Kingdom",
                state: "Cambridgeshire",
                city: "Cambridge",
                address: "15 JJ Thomson Avenue",
                is_corresponding_author: false
            }
        ],

        reviewer_first_name: "David",
        reviewer_last_name: "Lee",
        reviewer_email: "d.lee@imperial.ac.uk",
        reviewer_phone: "442075891234",
        reviewer_institution: "Imperial College London",
        reviewer_department: "Computing",
        reviewer_specialisation: "Quantum Information",
        reviewer_city: "London",
        reviewer_country: "United Kingdom",

        checklist: {
            is_sole_submission: true,
            is_not_published: true,
            is_original_work: true,
            has_declared_conflicts: true,
            has_acknowledged_support: true,
            has_acknowledged_funding: true,
            follows_guidelines: true
        },

        createdAt: "2024-12-10T09:15:00.000Z",
        updatedAt: "2024-12-25T16:45:00.000Z"
    }
];

/**
 * Mock API service for manuscripts
 * Simulates API delay for realistic testing
 * 
 * When replacing with real API, use:
 * manuscriptApi.getAll({ status: 'Awaiting Copyright' })
 */
export const mockManuscriptApi = {
    /**
     * Get all manuscripts with "Awaiting Copyright" status
     * @returns {Promise} Promise resolving to manuscripts data
     */
    getAwaitingCopyright: () => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                resolve({
                    data: {
                        success: true,
                        data: mockAwaitingCopyrightManuscripts,
                        message: "Manuscripts fetched successfully"
                    }
                });
            }, 500);
        });
    },

    /**
     * Get a single manuscript by ID
     * @param {number} id - Manuscript ID
     * @returns {Promise} Promise resolving to manuscript data
     */
    getById: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const manuscript = mockAwaitingCopyrightManuscripts.find(m => m.id === id);
                if (manuscript) {
                    resolve({
                        data: {
                            success: true,
                            data: manuscript,
                            message: "Manuscript fetched successfully"
                        }
                    });
                } else {
                    reject(new Error("Manuscript not found"));
                }
            }, 300);
        });
    }
};

/**
 * Mock Journal Issues Data
 * Used when real API is not available
 * 
 * TODO: Replace with real API call:
 * journalIssueApi.getByJournal(journalId)
 */
export const mockJournalIssues = {
    // Issues for Journal ID 5 (International Journal of Computer Science)
    5: [
        { id: 51, journal_id: 5, volume: 8, issue_no: 1, year: 2024, month: "January" },
        { id: 52, journal_id: 5, volume: 8, issue_no: 2, year: 2024, month: "April" },
        { id: 53, journal_id: 5, volume: 8, issue_no: 3, year: 2024, month: "July" },
        { id: 54, journal_id: 5, volume: 8, issue_no: 4, year: 2024, month: "October" },
        { id: 55, journal_id: 5, volume: 9, issue_no: 1, year: 2025, month: "January" },
    ],
    // Issues for Journal ID 8 (Journal of Healthcare Technology)
    8: [
        { id: 81, journal_id: 8, volume: 5, issue_no: 1, year: 2024, month: "February" },
        { id: 82, journal_id: 8, volume: 5, issue_no: 2, year: 2024, month: "June" },
        { id: 83, journal_id: 8, volume: 5, issue_no: 3, year: 2024, month: "October" },
        { id: 84, journal_id: 8, volume: 6, issue_no: 1, year: 2025, month: "February" },
    ]
};

/**
 * Mock API for Journal Issues
 * TODO: Replace with real API: journalIssueApi.getByJournal(journalId)
 */
export const mockJournalIssueApi = {
    getByJournal: (journalId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const issues = mockJournalIssues[journalId] || [];
                resolve({
                    data: {
                        success: true,
                        data: issues,
                        message: "Issues fetched successfully"
                    }
                });
            }, 300);
        });
    }
};

export default mockManuscriptApi;
