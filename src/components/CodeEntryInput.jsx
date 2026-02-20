import React, { useRef, useState, useEffect } from 'react';

const CodeEntryInput = ({ length = 4, onChange, onEnter }) => {
    const [code, setCode] = useState(new Array(length).fill(''));
    const inputs = useRef([]);

    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (onChangeRef.current) {
            onChangeRef.current(code.join(''));
        }
    }, [code]);

    const processInput = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Only allow numbers

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < length - 1) {
            inputs.current[index + 1].focus();
        }

        if (newCode.every(digit => digit !== '') && index === length - 1) {
            if (onEnter) onEnter();
        }
    };

    const onKeyUp = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex gap-2">
            {code?.length > 0 && code.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputs.current[index] = el)}
                    value={digit}
                    onChange={(e) => processInput(e, index)}
                    onKeyUp={(e) => onKeyUp(e, index)}
                    className="w-10 h-10 border border-gray-400 text-center text-lg focus:outline-none focus:border-black"
                />
            ))}
        </div>
    );
};

export default CodeEntryInput;
