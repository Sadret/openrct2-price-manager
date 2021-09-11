/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

const actionName = "price-manager-action";

export default class Server {
    static init() {
    }

    private readonly config: Config;

    public constructor(config: Config) {
        this.config = config;

        context.registerAction(
            actionName,
            () => ({}),
            () => ({}),
        );

        context.subscribe("action.execute", event => {
            if (event.action !== actionName)
                return;

            const player = this.getPlayer(event.player);
            if (player === undefined)
                return;

            const group = this.getGroup(player.group);
            if (group === undefined)
                return;

            const args = <PriceManagerActionArgs>event.args;
            switch (args.type) {
                case "setValue":
                    return this.setValue(args, group);
                case "getValue":
                    return this.getValue(args, group);
                case "getConfig":
                    return this.getConfig(args, group);
                case "broadcastValue":
                    return;
                case "broadcastConfig":
                    return;
            }
        });
    }

    private setValue(args: PriceManagerSetValueActionArgs, group: PlayerGroup): void {
        if (!this.isAuthorized(group, "write"))
            return;
        const property: Property<any> = this.config[args.key];
        property.setValue(args.value);
        // TODO: broadcast change
    }

    private getValue(args: PriceManagerGetValueActionArgs, group: PlayerGroup): void {
        if (!this.isAuthorized(group, "read"))
            return;
        const property: Property<any> = this.config[args.key];
        const value = property.getValue();
        this.broadcastValue(args.key, value);
    }

    private getConfig(args: PriceManagerGetConfigActionArgs, group: PlayerGroup): void {
        if (!this.isAuthorized(group, "read"))
            return;
        this.broadcastConfig();
    }

    private broadcastValue(key: keyof Config, value: any): void {
        context.executeAction(
            actionName,
            <PriceManagerBroadcastValueActionArgs>{
                type: "broadcastValue",
                key: key,
                value: value,
            },
            () => { },
        );
    }

    private broadcastConfig(): void {
        const result: any = {};
        for (let property in this.config)
            result[property] = (<any>this.config)[property].getValue();
        context.executeAction(
            actionName,
            <PriceManagerBroadcastConfigActionArgs>{
                type: "broadcastConfig",
                config: result,
            },
            () => { },
        );
    }

    private isAuthorized(group: PlayerGroup, mode: "read" | "write") {
        // TODO: check if config allows this group
        return true;
    }

    private getPlayer(id: number): Player | undefined {
        return find(network.players, player => player.id === id);
    }

    private getGroup(id: number): PlayerGroup | undefined {
        return find(network.groups, group => group.id === id);
    }
}

// polyfill of Arrays.find
function find<T>(arr: T[], fun: (val: T) => boolean): T | undefined {
    for (let val of arr)
        if (fun(val))
            return val;
    return undefined;
}
