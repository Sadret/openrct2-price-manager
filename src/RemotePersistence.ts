/*****************************************************************************
 * Copyright (c) 2021-2025 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type Config from "./Config";
import { ACTION_NAME } from "./Globals";
import type { GetValueActionArgs, Persistence, SetValueActionArgs } from "./types";

export default class RemotePersistence implements Persistence {
    public get<T>(key: keyof Config, defaultValue: T): T {
        const args: GetValueActionArgs = {
            type: "getValue",
            key: key,
        };
        context.executeAction(
            ACTION_NAME,
            args,
            () => { },
        );
        return defaultValue;
    }

    public set<T>(key: keyof Config, value: T): void {
        const args: SetValueActionArgs = {
            type: "setValue",
            key: key,
            value: value,
        };
        context.executeAction(
            ACTION_NAME,
            args,
            () => { },
        );
    }
}
