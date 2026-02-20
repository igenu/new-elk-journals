import React from 'react';
import { Button } from 'antd';

const SignatureGrid = ({ config, signatures, onSign, authors }) => {
    const headerBgClass = "bg-[#c4d69b] font-bold text-black border border-black p-2 align-top";
    const cellClass = "border border-black p-2 align-top text-sm break-words";
    const labelColumnClass = "w-[150px] bg-gray-50 font-semibold";

    // Force exactly 3 slots
    const slots = [0, 1, 2];

    return (
        <div className="mb-8 overflow-x-auto break-inside-avoid print-break-inside-avoid">
            {config.title && (
                <h3 className="text-md font-bold mb-2 uppercase text-gray-700">{config.title}</h3>
            )}
            <table className="w-full border-collapse border border-black min-w-[600px]">
                <thead>
                    <tr>
                        <th className={`${headerBgClass} ${config.detailed ? 'text-left w-[200px]' : ''}`}>
                            {config.detailed ? 'Signature & Date' : 'Agreement Confirmation'}
                        </th>
                        {slots.map(i => (
                            <th key={i} className={headerBgClass + " text-center w-1/4"}>
                                {i + 1}<sup>{i === 0 ? 'st' : i === 1 ? 'nd' : 'rd'}</sup> Author
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className={config.detailed ? "h-32" : ""}>
                        <td className={`${cellClass} ${labelColumnClass} align-middle`}>
                            {config.detailed ? (
                                <>
                                    <div className="font-semibold mb-1">Signature</div>
                                    <div className="text-xs text-gray-500">Please sign here if not signed above</div>
                                </>
                            ) : (
                                "Signature & Date"
                            )}
                        </td>

                        {slots.map(i => {
                            const hasAuthor = !!authors[i];
                            return (
                                <td key={i} className={cellClass}>
                                    <div className={`flex flex-col justify-between ${config.detailed ? 'h-full' : 'h-24'}`}>
                                        <div className="text-center flex-grow flex items-center justify-center">
                                            {signatures[i] ? (
                                                <div className="flex flex-col items-center">
                                                    {signatures[i].signatureImage ? (
                                                        <img
                                                            src={signatures[i].signatureImage}
                                                            alt="Signature"
                                                            className="max-h-12 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="font-script text-2xl text-blue-800" style={{ fontFamily: 'cursive' }}>{signatures[i].name}</span>
                                                    )}
                                                    <div className="text-[10px] text-gray-400 mt-1">Digitally Signed</div>
                                                    {config.detailed && (
                                                        <div className="mt-2 pt-1 border-t border-gray-400 w-1/2 text-xs">
                                                            {signatures[i].date}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                hasAuthor && onSign ? (
                                                    <div className="text-center print:hidden">
                                                        {!config.detailed && <div className="mb-1 text-xs text-gray-400">Not signed</div>}
                                                        <Button
                                                            size={config.detailed ? "middle" : "small"}
                                                            type={config.detailed ? "text" : "dashed"}
                                                            onClick={() => onSign(i)}
                                                            className={config.detailed ? "text-blue-600 underline" : "text-blue-600 border-blue-400 hover:border-blue-600"}
                                                        >
                                                            {config.detailed ? "Sign Here" : "Sign Now"}
                                                        </Button>
                                                    </div>
                                                ) : hasAuthor ? (
                                                    <div className="text-gray-400 text-xs italic">Not signed</div>
                                                ) : (
                                                    <div className="text-gray-300 text-xs italic">—</div>
                                                )
                                            )}
                                        </div>
                                        {!config.detailed && (
                                            <div className="border-t border-gray-300 pt-1 text-center text-xs mt-2">
                                                <strong>Date:</strong> {signatures[i]?.date || <span className="text-gray-300">DD/MM/YYYY</span>}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SignatureGrid;
