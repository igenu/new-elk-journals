import { useEffect, useRef } from 'react';

export const useRefreshOnFocus = (refetch) => {
    const refetchRef = useRef(refetch);

    useEffect(() => {
        refetchRef.current = refetch;
    }, [refetch]);

    useEffect(() => {
        const onFocus = () => {
            if (refetchRef.current) {
                refetchRef.current();
            }
        };

        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, []);
};

export default useRefreshOnFocus;
