/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import { ACTION } from "./Globals";

export default class RemotePersistence implements Persistence {
    public get<T>(key: keyof IConfig, defaultValue: T): T {
        const args: GetValueActionArgs = {
            type: "getValue",
            key: key,
        };
        context.executeAction(
            ACTION,
            args,
            () => { },
        );
        return defaultValue;
    }

    public set<T>(key: keyof IConfig, value: T): void {
        const args: SetValueActionArgs = {
            type: "setValue",
            key: key,
            value: value,
        };
        context.executeAction(
            ACTION,
            args,
            () => { },
        );
    }
}
