import React from 'react';

const KeyValueGrid = ({ config, data, resolveValue }) => {
    if (!config.fields) return null;

    return (
        <div className="mb-8 space-y-4">
            {config.fields.map((field, index) => {
                const value = resolveValue(data, field.key);

                return (
                    <div key={index} className={`flex flex-col md:flex-row gap-2 md:gap-4 items-start ${index > 0 && field.highlight ? 'mt-4' : ''}`}>
                        <span className="font-bold whitespace-nowrap text-lg">{field.label}:</span>
                        <span className={`flex-grow w-full text-lg ${field.italic ? 'italic border-b border-black' : ''} ${field.boldValue ? 'font-bold' : ''} ${field.highlight ? 'text-[#2c4a6e]' : ''}`}>
                            {value || '____________________'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default KeyValueGrid;
