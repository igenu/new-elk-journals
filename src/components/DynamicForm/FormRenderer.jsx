import React from 'react';
import StaticHtml from './elements/StaticHtml';
import KeyValueGrid from './elements/KeyValueGrid';
import DynamicTable from './elements/DynamicTable';
import SignatureGrid from './elements/SignatureGrid';

const FormRenderer = ({ schema, data, signatures, onSign }) => {
    if (!schema || !schema.sections) return null;

    // Helper to resolve deep keys (e.g. "journal.title")
    const resolveValue = (obj, path) => {
        return path?.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
    };

    return (
        <div className="dynamic-form-container">
            {schema.sections.map((section, index) => {
                const key = section.id || index;

                switch (section.type) {
                    case 'static_html':
                        return <StaticHtml key={key} config={section} />;

                    case 'key_value_grid':
                        return <KeyValueGrid key={key} config={section} data={data} resolveValue={resolveValue} />;

                    case 'dynamic_table':
                        return <DynamicTable key={key} config={section} data={data.authors || []} resolveValue={resolveValue} />;

                    case 'signature_grid':
                        return <SignatureGrid key={key} config={section} signatures={signatures} onSign={onSign} authors={data.authors || []} />;

                    default:
                        console.warn(`Unknown section type: ${section.type}`);
                        return null;
                }
            })}
        </div>
    );
};

export default FormRenderer;
