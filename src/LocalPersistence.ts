/*****************************************************************************
 * Copyright (c) 2021-2025 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type Config from "./Config";
import { PREFIX } from "./Globals";
import type { Persistence } from "./types";

export default class LocalPersistence implements Persistence {
    public get<T>(key: keyof Config, defaultValue: T): T {
        return context.sharedStorage.get(PREFIX + key, defaultValue);
    }

    public set<T>(key: keyof Config, value: T): void {
        return context.sharedStorage.set(PREFIX + key, value);
    }
}
