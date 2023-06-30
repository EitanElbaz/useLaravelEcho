import useLaravelEcho from './useLaravelEcho';
import useEchoChannelBase from './useEchoChannelBase';

function useEchoPrivateEncryptedChannel(channelName: string) {
    const { joinPrivateEncryptedChannel, leavePrivateEncryptedChannel } = useLaravelEcho();
    return useEchoChannelBase(
        channelName,
        joinPrivateEncryptedChannel,
        leavePrivateEncryptedChannel,
    );
}

export default useEchoPrivateEncryptedChannel;
