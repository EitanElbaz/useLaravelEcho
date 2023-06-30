import { Options } from 'pusher-js';
import Echo from 'laravel-echo';
import { Channel, PusherPresenceChannel } from 'laravel-echo/dist/channel';

export type LaravelEchoBroadcaster = 'pusher' | 'socket.io' | 'null' | 'function';

export type UseLaravelEchoProps = {
    appKey: string;
    broadcaster?: LaravelEchoBroadcaster;
    leaveDelayMs?: number;
    options: Options;

    /**
     * if using pusher, this would be set to new Pusher(appKey, options);
     *
     * By default, laravel-echo will try to use the pusher web client which is expected to be set on the `window` object.
     * https://github.com/laravel/echo/blob/master/src/connector/pusher-connector.ts#L31
     *
     * You can use the client property if you want to use the Pusher React Native client, for example.
     */
    client?: any;
};

export type PresenceChannelEventNames = {
    joined: string;
    memberJoined: string;
    memberLeft: string;
};

export type PresenceChannelListeners = {
    // when you join
    onJoined?: (members: Record<string, unknown>[]) => void;

    // when another person joined
    onMemberJoined?: (member: Record<string, unknown>) => void;

    // when another person leaves
    onMemberLeft?: (member: Record<string, unknown>) => void;
};

export type ChannelSubscriberReferences = { [channelName: string]: string[] };

export type ChannelJoinFunc<T> = (name: string, uuid: string) => T;

export type LaravelEchoContextValues = {
    echo?: Echo;
    options?: UseLaravelEchoProps;

    presenceChannelEventNames?: PresenceChannelEventNames;

    joinChannel?: ChannelJoinFunc<Channel>;
    leaveChannel?: ChannelJoinFunc<void>;

    joinPrivateChannel?: ChannelJoinFunc<Channel>;
    leavePrivateChannel?: ChannelJoinFunc<void>;

    joinPrivateEncryptedChannel?: ChannelJoinFunc<Channel>;
    leavePrivateEncryptedChannel?: ChannelJoinFunc<void>;

    joinPresenceChannel?: ChannelJoinFunc<PusherPresenceChannel>;
    leavePresenceChannel?: ChannelJoinFunc<void>;
};
