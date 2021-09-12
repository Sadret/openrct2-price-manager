/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

const actionName = "price-manager-action";

export default class Client implements Persistence {
    private readonly config: Config;

    public get<T>(key: keyof Config, defaultValue: T): T {
        this.getValue(key);
        return defaultValue;
    }

    public set<T>(key: keyof Config, value: T): void {
        this.setValue(key, value);
    }

    public constructor(config: Config) {
        this.config = config;

        context.subscribe("action.execute", event => {
            if (event.action !== actionName)
                return;

            const args = <PriceManagerActionArgs>event.args;
            switch (args.type) {
                case "setValue":
                    return;
                case "getValue":
                    return;
                case "broadcastValue":
                    return this.broadcastValue(args);
            }
        });
    }

    private setValue(key: keyof Config, value: any): void {
        const args: PriceManagerSetValueActionArgs = {
            type: "setValue",
            key: key,
            value: value,
        };
        context.executeAction(
            actionName,
            args,
            () => { },
        );
    }

    private getValue(key: keyof Config): void {
        const args: PriceManagerGetValueActionArgs = {
            type: "getValue",
            key: key,
        };
        context.executeAction(
            actionName,
            args,
            () => { },
        );
    }

    private broadcastValue(args: PriceManagerBroadcastValueActionArgs): void {
        (<Observable<any>>this.config[args.key]).setValue(args.value);
    }
}
