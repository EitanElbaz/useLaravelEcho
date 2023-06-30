import { Channel } from 'laravel-echo/dist/channel';
import useEchoListen from './useEchoListen';
import { useMemo } from 'react';

/**
 * You must prefix your event name with a `.` if you want to escape the default
 * namespace Laravel Echo prefixes event listening with
 * @param channel
 * @param eventName
 * @param callback
 */
function useEchoListenWhisper<T>(
    channel: Channel,
    eventName: string,
    callback: (data?: T) => void,
) {
    // prefixing the event name with 'client-' just like Laravel Echo does when you listen for a whisper
    const formattedName = useMemo(() => {
        // mirror the check to escape the namespace which happens in Laravel Echo
        if (eventName.charAt(0) === '.' || eventName.charAt(0) === '\\') {
            return `.client-${eventName.substr(1)}`;
        }

        return `client-${eventName}`;
    }, [eventName]);
    useEchoListen(channel, formattedName, callback);
}

export default useEchoListenWhisper;
