import React, { useCallback, useEffect, useState, useMemo, PropsWithChildren } from 'react';
import Echo from 'laravel-echo';
import { Options } from 'pusher-js';
import { useDebouncedCallback } from 'use-debounce';
import { PusherPresenceChannel } from 'laravel-echo/dist/channel';
import { LaravelEchoContextValues, PresenceChannelEventNames, UseLaravelEchoProps } from '../types';
import ChannelSubscriptionTracker from './ChannelSubscriptionTracker';

// context setup
export const LaravelEchoContext = React.createContext<LaravelEchoContextValues>({});

const UseLaravelEchoProvider: React.FC<PropsWithChildren<UseLaravelEchoProps>> = ({
    children,
    appKey,
    broadcaster,
    leaveDelayMs = 500,
    options,
}) => {
    const [echo, setEcho] = useState<Echo | undefined>();
    const [subTracker] = useState(new ChannelSubscriptionTracker());
    const memoOptions = useMemo<UseLaravelEchoProps>(
        () => ({ options, appKey, broadcaster }),
        [options, appKey, broadcaster],
    );

    const setupEcho = useCallback(
        (_options: Options) => new Echo({ ..._options, key: appKey, broadcaster }),
        [appKey, broadcaster],
    );
    useEffect(() => {
        if (!echo) {
            setEcho(setupEcho(options));
        }

        return () => {
            if (echo) {
                echo.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [echo, options]);

    const presenceChannelEventNames: PresenceChannelEventNames = useMemo(() => {
        if (broadcaster === 'socket.io') {
            return {
                joined: 'presence:subscribed',
                memberJoined: 'presence:joining',
                memberLeft: 'presence:leaving',
            };
        }
        // if (broadcaster === 'pusher') {
        return {
            joined: 'pusher:subscription_succeeded',
            memberJoined: 'pusher:member_added',
            memberLeft: 'pusher:member_removed',
        };
        // }
    }, [broadcaster]);

    /**
     * Delaying channel unsubscribing in case you've switched between 2 pages
     * which both want to subscribe to the same channel.
     */
    const debounced = useDebouncedCallback(
        (func: () => void) => {
            func();
        },
        // delay in ms
        leaveDelayMs,
    );

    const joinChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.addChannelSub(name, uuid);
            return echo?.channel(name);
        },
        [subTracker, echo],
    );

    const leaveChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.removeChannelSub(name, uuid);

            debounced(() => {
                if ((subTracker.ChannelSubs[name] ?? []).length <= 0) {
                    echo?.leaveChannel(name);
                }
            });
        },
        [subTracker, debounced, echo],
    );

    const joinPrivateChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.addPrivateChannelSub(name, uuid);
            return echo?.private(name);
        },
        [subTracker, echo],
    );

    const leavePrivateChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.removePrivateChannelSub(name, uuid);

            debounced(() => {
                if ((subTracker.PrivateChannelSubs[name] ?? []).length <= 0) {
                    echo?.leaveChannel(`private-${name}`);
                }
            });
        },
        [subTracker, debounced, echo],
    );

    const joinPrivateEncryptedChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.addPrivateEncryptedChannelSub(name, uuid);
            return echo?.encryptedPrivate(name);
        },
        [subTracker, echo],
    );

    const leavePrivateEncryptedChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.removePrivateEncryptedChannelSub(name, uuid);

            debounced(() => {
                if ((subTracker.PrivateEncryptedChannelSubs[name] ?? []).length <= 0) {
                    echo?.leaveChannel(`private-encrypted-${name}`);
                }
            });
        },
        [subTracker, debounced, echo],
    );

    const joinPresenceChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.addPresenceChannelSub(name, uuid);
            return echo?.join(name) as PusherPresenceChannel;
        },
        [subTracker, echo],
    );

    const leavePresenceChannel = useCallback(
        (name: string, uuid: string) => {
            subTracker.removePresenceChannelSub(name, uuid);

            debounced(() => {
                if ((subTracker.PresenceChannelSubs[name] ?? []).length <= 0) {
                    echo?.leaveChannel(`presence-${name}`);
                }
            });
        },
        [subTracker, debounced, echo],
    );

    const contextValue = useMemo(
        () => ({
            echo,
            presenceChannelEventNames,
            options: memoOptions,

            joinChannel,
            leaveChannel,

            joinPrivateChannel,
            leavePrivateChannel,

            joinPrivateEncryptedChannel,
            leavePrivateEncryptedChannel,

            joinPresenceChannel,
            leavePresenceChannel,
        }),
        [
            echo,
            joinChannel,
            joinPresenceChannel,
            joinPrivateChannel,
            joinPrivateEncryptedChannel,
            leaveChannel,
            leavePresenceChannel,
            leavePrivateChannel,
            leavePrivateEncryptedChannel,
            memoOptions,
            presenceChannelEventNames,
        ],
    );

    return (
        <LaravelEchoContext.Provider value={contextValue}>{children}</LaravelEchoContext.Provider>
    );
};

export default UseLaravelEchoProvider;
