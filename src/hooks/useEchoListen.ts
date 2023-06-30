import { Channel } from 'laravel-echo/dist/channel';
import { useEffect } from 'react';

/**
 * You must prefix your event name with a `.` if you want to escape the default
 * namespace Laravel Echo prefixes event listening with
 * @param channel
 * @param eventName
 * @param callback
 */
function useEchoListen<T>(channel: Channel, eventName: string, callback: (data?: T) => void) {
    useEffect(() => {
        if (channel) {
            channel.listen(eventName, callback);
        }

        const oldCallback = callback;

        return () => {
            if (channel) {
                channel.stopListening(eventName, oldCallback);
            }
        };
    }, [channel, eventName, callback]);
}

export default useEchoListen;
