/*****************************************************************************
 * Copyright (c) 2021-2023 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type Config from "./Config";
import { ACTION } from "./Globals";
import type Property from "./Property";
import type { BroadcastValueActionArgs, GetValueActionArgs, PriceManager, PriceManagerActionArgs, SetValueActionArgs, UpdatePricesActionArgs } from "./types";

export default class Server {
    private readonly config: Config;
    private readonly priceManager: PriceManager;

    public constructor(config: Config, priceManager: PriceManager) {
        this.config = config;
        this.priceManager = priceManager;

        for (let key in this.config)
            (this.config)[<keyof Config>key].observeValue(value => this.broadcastValue(<keyof Config>key, value));

        context.subscribe("action.execute", event => {
            if (event.action !== ACTION)
                return;

            const player = Server.getPlayer(event.player);
            if (player === undefined)
                return;

            const args = <PriceManagerActionArgs>event.args;
            switch (args.type) {
                case "setValue":
                    return this.setValue(args, player);
                case "getValue":
                    return this.getValue(args);
                case "broadcastValue":
                    return;
                case "updatePrices":
                    return this.updatePrices(args, player);
            }
        });
    }

    private setValue(args: SetValueActionArgs, player: Player): void {
        if (!Server.isWriteAuthorized(player, this.config))
            return;
        const key = args.key as keyof Config;
        if (!(key in this.config))
            return;
        if (key === "serverWriteAdminOnly" && !Server.isAdmin(player))
            return;
        const property: Property<any> = this.config[key];
        property.setValue(args.value);
    }

    private getValue(args: GetValueActionArgs): void {
        const key = args.key as keyof Config;
        if (!(key in this.config))
            return;
        const property = this.config[key];
        const value = property.getValue();
        this.broadcastValue(key, value);
    }

    private broadcastValue(key: keyof Config, value: any): void {
        const args: BroadcastValueActionArgs = {
            type: "broadcastValue",
            key: key,
            value: value,
        };
        context.executeAction(
            ACTION,
            args,
            () => { },
        );
    }

    private updatePrices(args: UpdatePricesActionArgs, player: Player): void {
        if (!Server.isWriteAuthorized(player, this.config))
            return;
        this.priceManager.updatePrices(args.makeRidesFree);
    }

    private static getPlayer(id: number): Player | undefined {
        return find(network.players, player => player.id === id);
    }

    public static isWriteAuthorized(player: Player, config: Config) {
        return Server.isAdmin(player) || !config.serverWriteAdminOnly.getValue();
    }

    public static isAdmin(player: Player) {
        return player.group === 0;
    }
}

// polyfill of Arrays.find
function find<T>(arr: T[], fun: (val: T) => boolean): T | undefined {
    for (let val of arr)
        if (fun(val))
            return val;
    return undefined;
}
