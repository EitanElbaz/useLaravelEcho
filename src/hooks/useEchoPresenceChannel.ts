import { useEffect, useState } from 'react';
import { PresenceChannel } from 'pusher-js';
import useLaravelEcho from './useLaravelEcho';
import useEchoChannelBase from './useEchoChannelBase';
import { PusherPresenceChannel } from 'laravel-echo/dist/channel';
import { PresenceChannelListeners } from '../types';

class PresenceTracker {
    public join?: PresenceChannelListeners['onJoined'];

    public memberJoined?: PresenceChannelListeners['onMemberJoined'];

    public memberLeft?: PresenceChannelListeners['onMemberLeft'];

    public prevJoin?: PresenceChannelListeners['onJoined'];

    public prevMemberJoined?: PresenceChannelListeners['onMemberJoined'];

    public prevMemberLeft?: PresenceChannelListeners['onMemberLeft'];

    public moveToPrev(newListeners?: PresenceChannelListeners) {
        this.prevJoin = this.join;
        this.prevMemberJoined = this.memberJoined;
        this.prevMemberLeft = this.memberLeft;

        this.join = newListeners?.onJoined;
        this.memberJoined = newListeners?.onMemberJoined;
        this.memberLeft = newListeners?.onMemberLeft;
    }

    public clearPrev() {
        this.prevJoin = null;
        this.prevMemberJoined = null;
        this.prevMemberLeft = null;
    }
}

function useEchoPresenceChannel(channelName: string, listeners?: PresenceChannelListeners) {
    const [tracker] = useState(new PresenceTracker());
    const { joinPresenceChannel, leavePresenceChannel, options, presenceChannelEventNames } =
        useLaravelEcho();
    const channel = useEchoChannelBase<PusherPresenceChannel>(
        channelName,
        joinPresenceChannel,
        leavePresenceChannel,
    );

    useEffect(() => {
        if (listeners && channel) {
            tracker.moveToPrev(listeners);

            channel.here(listeners?.onJoined);
            channel.joining(listeners?.onMemberJoined);
            channel.leaving(listeners?.onMemberLeft);
        }

        // for a reference
        const currentChannel = channel;
        const theTracker = tracker;
        return () => {
            //
            if (currentChannel && theTracker && options?.broadcaster) {
                if (options.broadcaster === 'pusher') {
                    (currentChannel.subscription as PresenceChannel).unbind(
                        presenceChannelEventNames.joined,
                    );
                    (currentChannel.subscription as PresenceChannel).unbind(
                        presenceChannelEventNames.memberJoined,
                    );
                    (currentChannel.subscription as PresenceChannel).unbind(
                        presenceChannelEventNames.memberLeft,
                    );
                } else if (options.broadcaster === 'socket.io') {
                    currentChannel.stopListening(
                        `.${presenceChannelEventNames.joined}`,
                        theTracker.prevJoin,
                    );
                    currentChannel.stopListening(
                        `.${presenceChannelEventNames.memberJoined}`,
                        theTracker.prevMemberJoined,
                    );
                    currentChannel.stopListening(
                        `.${presenceChannelEventNames.memberLeft}`,
                        theTracker.prevMemberLeft,
                    );
                }
                theTracker.clearPrev();
            }
        };
    }, [
        channel,
        listeners,
        options.broadcaster,
        presenceChannelEventNames.joined,
        presenceChannelEventNames.memberJoined,
        presenceChannelEventNames.memberLeft,
        tracker,
    ]);

    return channel;
}

export default useEchoPresenceChannel;
