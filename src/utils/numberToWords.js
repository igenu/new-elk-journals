/**
 * Convert a number to words
 * @param {number} num - The number to convert
 * @returns {string} - The number in words followed by "words only"
 */
export const numberToWords = (num) => {
    if (!num || num === 0) return '';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    const convertLessThanThousand = (n) => {
        if (n === 0) return '';

        let result = '';

        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }

        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            result += teens[n - 10] + ' ';
            return result.trim();
        }

        if (n > 0) {
            result += ones[n] + ' ';
        }

        return result.trim();
    };

    const convert = (n) => {
        if (n === 0) return 'Zero';

        let result = '';

        // Crore (10,000,000)
        if (n >= 10000000) {
            result += convertLessThanThousand(Math.floor(n / 10000000)) + ' Crore ';
            n %= 10000000;
        }

        // Lakh (100,000)
        if (n >= 100000) {
            result += convertLessThanThousand(Math.floor(n / 100000)) + ' Lakh ';
            n %= 100000;
        }

        // Thousand
        if (n >= 1000) {
            result += convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand ';
            n %= 1000;
        }

        // Remaining
        if (n > 0) {
            result += convertLessThanThousand(n);
        }

        return result.trim();
    };

    const words = convert(parseInt(num));
    return words ? `${words} words only` : '';
};
