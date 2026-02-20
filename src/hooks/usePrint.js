import { useReactToPrint } from 'react-to-print';

/**
 * A reusable hook to handle printing of specific components.
 * 
 * @param {Object} contentRef - The ref of the component to be printed.
 * @param {string} documentTitle - The title of the document (used for the PDF file name).
 * @returns {Function} handlePrint - The function to trigger the print dialog.
 */
const usePrint = (contentRef, documentTitle = 'Document') => {
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: documentTitle,
    });

    return handlePrint;
};

export default usePrint;
