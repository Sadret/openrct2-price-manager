/*****************************************************************************
 * Copyright (c) 2021-2025 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type Config from "./Config";
import { ACTION } from "./Globals";
import type Property from "./Property";
import type { BroadcastValueActionArgs, PriceManager, PriceManagerActionArgs, UpdatePricesActionArgs } from "./types";

export default class RemotePriceManager implements PriceManager {
    private readonly config: Config;

    public constructor(config: Config) {
        this.config = config;

        context.subscribe("action.execute", event => {
            if (event.action !== ACTION)
                return;

            const args = <PriceManagerActionArgs>event.args;
            switch (args.type) {
                case "setValue":
                    return;
                case "getValue":
                    return;
                case "broadcastValue":
                    return this.broadcastValue(args);
                case "updatePrices":
                    return;
            }
        });
    }

    private broadcastValue(args: BroadcastValueActionArgs): void {
        (<Property<unknown>>this.config[args.key as keyof Config])?.setValue(args.value);
    }

    public updatePrices(makeRidesFree: boolean = false): void {
        const args: UpdatePricesActionArgs = {
            type: "updatePrices",
            makeRidesFree: makeRidesFree,
        }
        context.executeAction(
            ACTION,
            args,
            () => { },
        );
    }
}
