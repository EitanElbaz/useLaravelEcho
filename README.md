# `useLaravelEcho`

> Easy as [React hooks](https://reactjs.org/docs/hooks-intro.html) that integrate with the [`laravel-echo`](https://github.com/laravel/echo) library.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What's the point of this library?](#whats-the-point-of-this-library)
- [Install](#install)
- [Usage](#usage)
- [Hooks](#hooks)
- [`useEchoChannel`](#useechochannel)
- [`useEchoPrivateChannel`](#useechoprivatechannel)
- [`useEchoPrivateEncryptedChannel`](#useechoprivateencryptedchannel)
- [`useEchoPresenceChannel`](#useechopresencechannel)
- [`useEchoListen`](#useecholisten)
- [`useEchoListenWhisper`](#useecholistenwhisper)
- [UseLaravelEchoProvider Additional Props](#uselaravelechoprovider-additional-props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### What's the point of this library?

[`laravel-echo`](https://github.com/laravel/echo) provides an easy to use set of APIs to connect to a websocket server. While using laravel-echo by itself techinically "works", it requires you to carefully manage channel and event subscriptions. You'll have to manually unsubscribe from channels and events as users navigate around your application. Or resubscribe to the same events when your callback function references change.

This library automatically manages your server, channel and event subscriptions by unsubscribing from channels and event listeners automatically, and by updating the callback references to your event subscriptions without you, the developer, ever having to think about it.

## Install

__-- COMING SOON TO NPM --__

```
// yarn
yarn add useLaravelEcho pusher-js laravel-echo

// npm
npm i --save useLaravelEcho pusher-js laravel-echo
```

## Usage

You must wrap your app with a `UseLaravelEchoProvider` and pass it config props for the connection and hooks to work.

```jsx
import React from "react";
import { UseLaravelEchoProvider } from 'useLaravelEcho';

// if you want to use pusher-js
window.Pusher = require('pusher-js');

const config = {
    cluster: "eu",
    forceTLS: true,
    auth: {
        headers: {
            Authorization: "Bearer token",
        },
    },
};

// Wrap app in provider
const App = () => (
    <UseLaravelEchoProvider appKey="1234" broadcaster="pusher" options={config}>
        <Example />
    </UseLaravelEchoProvider>
);
```

## Hooks

- [`useEchoChannel`](#useechochannel)
- [`useEchoPrivateChannel`](#useechoprivatechannel)
- [`useEchoPrivateEncryptedChannel`](#useechoprivateencryptedchannel)
- [`useEchoPresenceChannel`](#useechopresencechannel)
- [`useEchoListen`](#useecholisten)
- [`useEchoListenWhisper`](#useecholistenwhisper)


## `useEchoChannel`

Use this hook to subscribe to a channel.

The channel will be automatically unsubscribed from on a delay when you have no more listeners set via hooks.

```jsx
import React from "react";
import { useEchoChannel } from 'useLaravelEcho';

const Example = () => {
    // returns an echo channel instance.
    const channel = useEchoChannel("channel-name");
    
    return </div>;
};
```

## `useEchoPrivateChannel`

Use this hook to subscribe to a private channel. This will trigger a broadcast authentication request before the channel is successfully subscribed to.

The channel will be automatically unsubscribed from on a delay when you have no more listeners set via hooks.

```jsx
import React from "react";
import { useEchoPrivateChannel } from 'useLaravelEcho';

const Example = () => {
    // returns an echo channel instance.
    const channel = useEchoPrivateChannel("channel-name");
    
    return </div>;
};
```

## `useEchoPrivateEncryptedChannel`

Use this hook to subscribe to a private encrypted channel. This will trigger a broadcast authentication request before the channel is successfully subscribed to.

The channel will be automatically unsubscribed from on a delay when you have no more listeners set via hooks.

```jsx
import React from "react";
import { useEchoPrivateEncryptedChannel } from 'useLaravelEcho';

const Example = () => {
    // returns an echo channel instance.
    const channel = useEchoPrivateEncryptedChannel("channel-name");
    
    return </div>;
};
```

## `useEchoPresenceChannel`

Use this hook to subscribe to a presence channel. This will trigger a broadcast authentication request before the channel is successfully subscribed to.

The channel will be automatically unsubscribed from on a delay when you have no more listeners set via hooks.

```jsx
import React from "react";
import { useEchoPresenceChannel } from 'useLaravelEcho';

const Example = () => {
    // returns an echo presence channel instance.
    const channel = useEchoPresenceChannel("channel-name");
    
    return </div>;
};
```

You can also subscribe to presence channel events. `onJoined` (you), `onMemberJoined` (someone else), `onMemberLeft` (someone else)

```jsx
    const onJoined = useCallback(
        allMembers => {
            console.log('--- I joined ---', allMembers);
        },
        [],
    );
    const onMemberJoined = useCallback(
        member => {
            console.log('--- new member ---', member);
        },
        [],
    );
    const onMemberLeft = useCallback(
        member => {
            console.log('--- member left ---', member);
        },
        [],
    );

    const listeners = useMemo(() => {
        return { onJoined: onJoined, onMemberJoined: onMemberJoined, onMemberLeft: onMemberLeft };
    }, [onJoined, onNewUser, onUserLeft]);

    useEchoPresenceChannel(channelName, listeners);
```

## `useEchoListen`

Use this hook to subscribe to an event in a channel. The registered event callback is automatically unregistered when your component unmounts.

```jsx
import React, { useCallback } from "react";
import { useEchoListen, useEchoChannel } from 'useLaravelEcho';

const Example = () => {
    
    const callback = useCallback((data) => {
        console.log('callback triggered!', data);
    }, []);

    useEchoListen(useEchoChannel('General'), '.update', callback);
    
    return </div>;
};
```

## `useEchoListenWhisper`

Use this hook to subscribe to client triggered event (whisper) in a presence channel. The registered event callback is automatically unregistered when your component unmounts.

```jsx
import React, { useCallback } from "react";
import { useEchoListenWhisper, useEchoPresenceChannel } from 'useLaravelEcho';

const Example = () => {
    
    const callback = useCallback((data) => {
        console.log('callback triggered!', data);
    }, []);

    useEchoListenWhisper(useEchoPresenceChannel('Chat'), '.new-message', callback);
    
    return </div>;
};
```

## UseLaravelEchoProvider Additional Props

You can provide additional props to `UseLaravelEchoProvider`

| option       | default                       | Description                                   | Example                         |
| ------------ | ----------------------------- | --------------------------------------------- | ------------------------------- |
| leaveDelayMs | 500 | The amount of time to wait (in milliseconds) before unsubscribing from a channel | This is only really applicable to Single Page Applications (SPA). Imagine a scenario where you have two routes (pages) which both want to subscribe to the same channel via a `useEchoChannel("channel-name")` hook. If there was no leave delay on unmount, the channel will be unsubscribed from when the first page unmounts and then resubscribed to when the next page mounts. Obviously we don't really want this to happen, so by default, we wait 500ms before unsubscribing to check if any additional subscriptions had occurred. |

