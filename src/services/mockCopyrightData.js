export const COPYRIGHT_TEMPLATE = {
    title: "Copyright Agreement Form",
    version: "1.0",
    sections: [
        {
            id: "header",
            type: "static_html",
            content: `
                <div class="border-b-2 border-gray-800 pb-4 mb-8 text-center">
                    <h1 class="text-2xl md:text-3xl font-bold uppercase underline mb-2 tracking-wide">
                        Agreement in Relation to Copyright and Originality
                    </h1>
                </div>
            `
        },
        {
            id: "manuscript_info",
            type: "key_value_grid",
            fields: [
                { label: "Title of the Manuscript", key: "paper_title", italic: true },
                { label: "Author(s)", key: "authors_formatted", italic: true },
                { label: "To be published in the Journal", key: "journal.title", boldValue: true, highlight: true }
            ]
        },
        {
            id: "assignment_text",
            type: "static_html",
            content: `
                <div class="mb-8">
                    <h2 class="text-xl font-bold mb-3 border-l-4 border-[#12b48b] pl-3">Assignment of Publishing Rights</h2>
                    <p class="text-justify mb-3">
                        I/We hereby assign to the publisher, <strong>Journal Press India</strong>, the world-wide copyright in the above specified manuscript in all forms and all media, whether now known or hereafter developed.
                    </p>
                    <p class="text-justify mb-3">
                        I/We understand that Journal Press India will act on my/our behalf to publish, reproduce, distribute and transmit the Work and will authorise other reputable third parties (such as document delivery services) to do the same, ensuring access to and maximum dissemination of the Work.
                    </p>
                </div>
            `
        },
        {
            id: "agreement_list",
            type: "static_html",
            content: `
                <div class="mb-8">
                    <h2 class="text-xl font-bold mb-3 border-l-4 border-[#12b48b] pl-3">Article Publishing Agreement</h2>
                    <p class="mb-3">I/we agree to the following, with regard to the above specified manuscript submitted to Journal Press India for publication.</p>
                    <ol class="list-decimal pl-6 space-y-2 text-justify">
                        <li>I/We have obtained the necessary written permission from the appropriate copyright owner or authorities for the reproduction in the Article and in the Journal of any text, illustration or other material. (Please attach any permission documents, if applicable).</li>
                        <li>The Article is my/our original work, and does not infringe the intellectual property rights of any other person or entity and cannot be considered as plagiarising any other published work.</li>
                        <li>The Article is not currently under submission to, or consideration by, any other journal or publication.</li>
                        <li>The Article has not been published before in its current or a substantially similar form.</li>
                        <li>I/we have not previously assigned or licensed the article to any third party.</li>
                        <li>The Article contains no statement that is abusive, defamatory, fraudulent, or in any other way unlawful or in violation of applicable laws.</li>
                        <li>I/we have declared any potential conflict of interest in the research. Any support from a third party has been noted in the Acknowledgements.</li>
                    </ol>
                </div>
            `
        },
        {
            id: "signature_grid_1",
            type: "signature_grid",
            title: "Agreement Confirmation",
            authorCount: 3
        },
        {
            id: "guidelines",
            type: "static_html",
            content: `
                <div class="mb-8">
                    <ol class="list-decimal pl-6 space-y-2 text-justify" start="8">
                        <li>Anyone who has made a significant contribution to this article been listed as an author. Minor contributors have been noted in the Acknowledgements section.</li>
                        <li>I/we will not permit others to electronically gather and save my/our Article to a separate server.</li>
                    </ol>
                    <p class="mt-4 font-semibold italic text-gray-700">I/we assert my/our moral rights to be identified as the author/s of the Work.</p>
                    <p class="text-justify mt-2">I/we acknowledge that Journal Press India would publish my/our article in the above specified article and that it reserves the right to make such editorial changes as may be required to make the Article suitable for publication.</p>
                </div>
            `
        },
        {
            id: "author_details_table",
            type: "dynamic_table",
            title: "Author Details",
            columns: [
                { header: "Field", type: "label", width: "200px" },
                { header: "{ordinal} Author", type: "value", width: "auto" } // {ordinal} is a special placeholder e.g. 1st, 2nd
            ],
            rows: [
                { label: "Corresponding Author", subLabel: "(Yes/No)", key: "is_corresponding_author", type: "boolean" },
                { label: "Title", subLabel: "(Prof/Dr/Mr/Ms)", key: "title" },
                { label: "Full Name", key: "full_name", bold: true }, // computed property or specific keys
                { label: "Designation", key: "designation" },
                { label: "Institutional Affiliation", key: "institution" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Country", key: "country" },
                { label: "Email Id", key: "email", isLink: true },
                { label: "Mobile Number", key: "phone" }
            ]
        },
        {
            id: "signature_grid_2",
            type: "signature_grid",
            title: "Detailed Signatures",
            detailed: true, // shows date input or display
            authorCount: 3
        },
        {
            id: "footer_note",
            type: "static_html",
            content: `
                 <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 flex items-start gap-3 print:bg-transparent print:border-none print:p-0">
                    <div class="text-sm text-gray-700 italic">
                        <strong>*Note:</strong> The author(s) need to sign both the pages of this form.
                    </div>
                </div>
            `
        }
    ]
};
