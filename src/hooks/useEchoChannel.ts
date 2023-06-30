import useLaravelEcho from './useLaravelEcho';
import useEchoChannelBase from './useEchoChannelBase';

function useEchoChannel(channelName: string) {
    const { joinChannel, leaveChannel } = useLaravelEcho();
    return useEchoChannelBase(channelName, joinChannel, leaveChannel);
}

export default useEchoChannel;
