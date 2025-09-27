/*****************************************************************************
 * Copyright (c) 2021-2025 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type Config from "./Config";
import { PLUGIN_NAME } from "./Globals";
import type { Persistence } from "./types";

export default class LocalPersistence implements Persistence {
    public get<T>(key: keyof Config, defaultValue: T): T {
        return context.getParkStorage(PLUGIN_NAME).get(key) || context.sharedStorage.get(`${PLUGIN_NAME}.${key}`, defaultValue);
    }

    public set<T>(key: keyof Config, value: T): void {
        return context.getParkStorage(PLUGIN_NAME).set(key, value);
    }
}
