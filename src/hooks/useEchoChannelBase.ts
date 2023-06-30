import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Channel } from 'laravel-echo/dist/channel';
import { ChannelJoinFunc } from '../types';
import useLaravelEcho from './useLaravelEcho';

function useEchoChannelBase<T extends Channel = Channel>(
    channelName: string,
    joinFunc: ChannelJoinFunc<T>,
    leaveFunc: ChannelJoinFunc<void>,
): T | undefined {
    const { echo } = useLaravelEcho();
    const [channel, setChannel] = useState<T | undefined>();

    useEffect(() => {
        const uuid = v4();
        const newChannel = joinFunc(channelName, uuid);
        setChannel(newChannel);
        return () => {
            leaveFunc(channelName, uuid);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelName, echo]);

    return channel;
}

export default useEchoChannelBase;
