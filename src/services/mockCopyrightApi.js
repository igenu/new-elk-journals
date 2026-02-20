import { COPYRIGHT_TEMPLATE } from './mockCopyrightData';

const MOCK_MANUSCRIPT = {
    id: "manuscript_123",
    paper_title: "Advances in Quantum Computing Algorithms",
    journal: {
        title: "International Journal of Computer Science"
    },
    authors: [
        {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            is_corresponding_author: true,
            title: "Dr.",
            designation: "Professor",
            institution: "University of Technology",
            city: "New York",
            state: "NY",
            country: "USA",
            email: "john.doe@tech.edu",
            phone: "+1-555-0123"
        },
        {
            id: 2,
            first_name: "Jane",
            last_name: "Smith",
            is_corresponding_author: false,
            title: "Ms.",
            designation: "Researcher",
            institution: "Science Institute",
            city: "London",
            state: "",
            country: "UK",
            email: "jane.smith@science.org",
            phone: "+44-20-7946"
        },
        {
            id: 3,
            first_name: "Robert",
            last_name: "Brown",
            is_corresponding_author: false,
            title: "Mr.",
            designation: "PhD Student",
            institution: "Tech University",
            city: "Berlin",
            state: "",
            country: "Germany",
            email: "robert.brown@tu-berlin.de",
            phone: "+49-30-123456"
        }
    ]
};

export const mockCopyrightApi = {
    getTemplate: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(COPYRIGHT_TEMPLATE), 500);
        });
    },

    getManuscript: async (id) => {
        // In a real app, this would fetch by ID. Here we just return the mock.
        return new Promise((resolve) => {
            setTimeout(() => {
                // Enhance mock with formatted fields needed for template
                const enhanced = {
                    ...MOCK_MANUSCRIPT,
                    authors_formatted: MOCK_MANUSCRIPT.authors.map(a => `${a.first_name} ${a.last_name}`).join(', ')
                };
                resolve({ data: enhanced });
            }, 600);
        });
    },

    submitForm: async (data, signatures) => {
        return new Promise((resolve) => {
            console.log("Submitting Copyright Form:", { data, signatures });
            setTimeout(() => resolve({ success: true, message: "Copyright Submitted Successfully" }), 800);
        });
    }
};
