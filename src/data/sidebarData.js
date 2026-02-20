import { FaBook, FaEye, FaNewspaper, FaFileAlt, FaEnvelope, FaUserShield, FaFileContract, FaClipboardList } from 'react-icons/fa';

export const sidebarData = [
    {
        title: 'Manage Journals',
        icon: FaBook, // Storing component reference directly
        path: '#',
        access: ["admin", "subadmin"],
        subNav: [
            {
                title: 'View Journals',
                path: '/dashboard/view-journal',
                icon: FaEye,
                access: ["admin", "subadmin"]
            },
            {
                title: 'View Journal Issues',
                path: '/dashboard/journal-issues',
                icon: FaNewspaper,
                access: ["admin", "subadmin"]
            },
            {
                title: 'Journal Categories',
                path: '/dashboard/journal-categories',
                icon: FaBook,
                access: ["admin", "subadmin"]
            },

        ]
    },
    {
        title: 'Manage Subadmins',
        icon: FaUserShield,
        path: '/dashboard/manage-subadmins',
        access: ["admin"]
    },
    {
        title: 'Manage User',
        icon: FaBook,
        path: '/dashboard/manage-users',
        access: ["admin", "subadmin"]
    },
    {
        title: 'View Submitted Publication',
        icon: FaNewspaper,
        path: '/dashboard/view-submitter-publications',
        access: ["admin", "subadmin"]
    },
    // {
    //     title: 'Manage News',
    //     icon: FaNewspaper,
    //     path: '/dashboard/manage-news',
    //     access: ["admin", "subadmin"]
    // },
    {
        title: 'Conference',
        icon: FaBook,
        path: '#',
        access: ["admin", "subadmin"],
        subNav: [
            {
                title: 'Add Conference',
                path: '/dashboard/add-conference',
                icon: FaFileAlt,
                access: ["admin", "subadmin"]
            },
            {
                title: 'Conference Template',
                path: '/dashboard/conference-templates',
                icon: FaFileAlt,
                access: ["admin", "subadmin"]
            },
            // {
            //     title: 'Registrations',
            //     path: '/dashboard/conference-registrations',
            //     icon: FaBook,
            //     access: ["admin", "subadmin"]
            // },
            // {
            //     title: 'Abstract Submissions',
            //     path: '/dashboard/conference/abstract-management',
            //     icon: FaFileAlt,
            //     access: ["admin", "subadmin"]
            // }
        ]
    },
    {
        title: 'Contact Us Inquiries',
        icon: FaEnvelope,
        path: '/dashboard/contact-us',
        access: ["admin", "subadmin"]
    },
    {
        title: 'Proposal Requests',
        icon: FaClipboardList,
        path: '/dashboard/proposal-requests',
        access: ["admin", "subadmin"]
    },

    {
        title: 'Submit Manuscript',
        icon: FaEnvelope,
        path: '/dashboard/submit-manuscript',
        access: ["author"]
    },
    {
        title: 'Full Paper Submission',
        icon: FaFileAlt,
        path: '/dashboard/conference/full-paper-submission',
        access: ["author"]
    },
    {
        title: 'Review Abstractions',
        icon: FaFileAlt,
        path: '/dashboard/editor/review-abstracts',
        access: ["editor"]
    },
    {
        title: 'Assigned Manuscripts',
        icon: FaFileContract,
        path: '/dashboard/editor/manuscripts',
        access: ["editor"]
    }
];
