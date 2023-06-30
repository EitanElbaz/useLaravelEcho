import useLaravelEcho from './useLaravelEcho';
import useEchoChannelBase from './useEchoChannelBase';

function useEchoPrivateChannel(channelName: string) {
    const { joinPrivateChannel, leavePrivateChannel } = useLaravelEcho();
    return useEchoChannelBase(channelName, joinPrivateChannel, leavePrivateChannel);
}

export default useEchoPrivateChannel;
