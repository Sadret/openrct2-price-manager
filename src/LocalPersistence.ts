/*****************************************************************************
 * Copyright (c) 2021-2023 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import { PREFIX } from "./Globals";

export default class LocalPersistence implements Persistence {
    public get<T>(key: keyof IConfig, defaultValue: T): T {
        return context.sharedStorage.get(PREFIX + key, defaultValue);
    }

    public set<T>(key: keyof IConfig, value: T): void {
        return context.sharedStorage.set(PREFIX + key, value);
    }
}
