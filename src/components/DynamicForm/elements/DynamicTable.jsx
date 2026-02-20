import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const DynamicTable = ({ config, data, resolveValue }) => {
    // data is expected to be an array (e.g., authors)
    // config.columns defines the header
    // config.rows defines the row content, where each row is a property of the data item

    const headerBgClass = "bg-[#c4d69b] font-bold text-black border border-black p-2 align-top";
    const cellClass = "border border-black p-2 align-top text-sm break-words";

    // Helper to render cell content based on type/config
    const renderCellContent = (item, rowConfig) => {
        const value = resolveValue(item, rowConfig.key);

        if (rowConfig.type === 'boolean') {
            return value ? (
                <div className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-1 rounded">
                    <FaCheckCircle size={12} /> Yes
                </div>
            ) : <span className="text-gray-400">No</span>;
        }

        if (rowConfig.isLink && value) {
            return <a href={`mailto:${value}`} className="text-blue-600 hover:underline break-all">{value}</a>;
        }

        if (rowConfig.bold) {
            return <div className="font-medium text-gray-900">{value}</div>;
        }

        return <div className="text-sm">{value}</div>;
    };

    const slots = [0, 1, 2];

    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 uppercase text-[#2c4a6e] border-b border-gray-300 pb-2">
                {config.title}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black min-w-[700px]">
                    <thead>
                        <tr>
                            {config.columns.map((col, idx) => {
                                if (col.type === 'label') {
                                    return <th key={idx} className={`${headerBgClass} text-left`} style={{ width: col.width }}>{col.header}</th>;
                                }
                                // Force exactly 3 columns for authors
                                return slots.map((itemIdx) => {
                                    const ordinal = itemIdx === 0 ? '1st' : itemIdx === 1 ? '2nd' : itemIdx === 2 ? '3rd' : `${itemIdx + 1}th`;
                                    const headerText = col.header.replace('{ordinal}', ordinal);
                                    return (
                                        <th key={`${idx}-${itemIdx}`} className={`${headerBgClass} text-center`} style={{ width: `calc(100% / 4)` }}>
                                            {headerText}
                                        </th>
                                    );
                                });
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {config.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                <td className={cellClass}>
                                    <div className="font-semibold">{row.label}</div>
                                    {row.subLabel && <div className="text-xs text-gray-500">{row.subLabel}</div>}
                                </td>
                                {slots.map((itemIdx) => {
                                    const item = data[itemIdx];
                                    return (
                                        <td key={itemIdx} className={`${cellClass} ${row.type === 'boolean' ? 'text-center align-middle' : ''}`}>
                                            {item ? renderCellContent(item, row) : <div className="text-gray-300">—</div>}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DynamicTable;
