/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import { ACTION } from "./Globals";

export default class Client implements IPriceManager {
    private readonly config: IConfig;

    public constructor(config: IConfig) {
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
        (<Observable<any>>this.config[args.key]).setValue(args.value);
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
