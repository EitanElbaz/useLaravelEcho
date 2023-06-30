import { useContext, useEffect } from 'react';
import { LaravelEchoContextValues } from '../types';
import { LaravelEchoContext } from '../components/UseLaravelEchoProvider';

const NOT_IN_CONTEXT_WARNING =
    'No LaravelEcho context wrapper. Did you forget to wrap your application in a <UseLaravelEchoProvider /> component?';

function useLaravelEcho(): Required<LaravelEchoContextValues> {
    const context = useContext<LaravelEchoContextValues>(LaravelEchoContext);
    useEffect(() => {
        if (!Object.keys(context).length) console.warn(NOT_IN_CONTEXT_WARNING);
    }, [context]);
    return context as Required<LaravelEchoContextValues>;
}

export default useLaravelEcho;
