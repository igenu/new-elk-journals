import React from 'react';
import DOMPurify from 'dompurify';

const StaticHtml = ({ config }) => {
    const cleanHtml = DOMPurify.sanitize(config.content);

    // If className is provided in config (as per architecture), we can apply it.
    // However, the current content in mock data usually has wrapper divs with classes.
    // We can wrap it in a div if className is present, or just return the html.

    if (config.className) {
        return <div className={config.className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
    }

    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default StaticHtml;
