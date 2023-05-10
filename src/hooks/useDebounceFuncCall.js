import {useEffect, useState} from "react";

const useDebounceFuncCall = (func, delay) => {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        if (counter > 0) {
            const handler = setTimeout(() => {
                func?.();
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        }
    }, [counter]);
    const delayFuncCall = () => setCounter(prev => prev + 1);
    return {counter, delayFuncCall};
}

export default useDebounceFuncCall;
