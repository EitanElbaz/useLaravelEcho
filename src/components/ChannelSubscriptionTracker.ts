import { ChannelSubscriberReferences } from '../types';

class ChannelSubscriptionTracker {
    private publicChannelSubs: ChannelSubscriberReferences = {};

    private privateChannelSubs: ChannelSubscriberReferences = {};

    private privateEncryptedChannelSubs: ChannelSubscriberReferences = {};

    private presenceChannelSubs: ChannelSubscriberReferences = {};

    get ChannelSubs() {
        return this.publicChannelSubs;
    }

    get PrivateChannelSubs() {
        return this.privateChannelSubs;
    }

    get PrivateEncryptedChannelSubs() {
        return this.privateEncryptedChannelSubs;
    }

    get PresenceChannelSubs() {
        return this.presenceChannelSubs;
    }

    public addChannelSub(name: string, uuid: string) {
        const list = this.publicChannelSubs[name] ?? [];
        if (list.indexOf(uuid) === -1) {
            this.publicChannelSubs[name] = [...list, uuid];
        }
    }

    public removeChannelSub(name: string, uuid: string) {
        const list = this.publicChannelSubs[name] ?? [];
        if (list.indexOf(uuid) !== -1) {
            this.publicChannelSubs[name] = list.filter(id => id !== uuid);
        }
    }

    public addPrivateChannelSub(name: string, uuid: string) {
        const list = this.privateChannelSubs[name] ?? [];
        if (list.indexOf(uuid) === -1) {
            this.privateChannelSubs[name] = [...list, uuid];
        }
    }

    public removePrivateChannelSub(name: string, uuid: string) {
        const list = this.privateChannelSubs[name] ?? [];
        if (list.indexOf(uuid) !== -1) {
            this.privateChannelSubs[name] = list.filter(id => id !== uuid);
        }
    }

    public addPrivateEncryptedChannelSub(name: string, uuid: string) {
        const list = this.privateEncryptedChannelSubs[name] ?? [];
        if (list.indexOf(uuid) === -1) {
            this.privateEncryptedChannelSubs[name] = [...list, uuid];
        }
    }

    public removePrivateEncryptedChannelSub(name: string, uuid: string) {
        const list = this.privateEncryptedChannelSubs[name] ?? [];
        if (list.indexOf(uuid) !== -1) {
            this.privateEncryptedChannelSubs[name] = list.filter(id => id !== uuid);
        }
    }

    public addPresenceChannelSub(name: string, uuid: string) {
        const list = this.presenceChannelSubs[name] ?? [];
        if (list.indexOf(uuid) === -1) {
            this.presenceChannelSubs[name] = [...list, uuid];
        }
    }

    public removePresenceChannelSub(name: string, uuid: string) {
        const list = this.presenceChannelSubs[name] ?? [];
        if (list.indexOf(uuid) !== -1) {
            this.presenceChannelSubs[name] = list.filter(id => id !== uuid);
        }
    }
}

export default ChannelSubscriptionTracker;
