/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

const prefix = "price_manager.";

export default class Storage implements Persistence {
    public get<T>(key: keyof Config, defaultValue: T): T {
        return context.sharedStorage.get(prefix + key, defaultValue);
    }

    public set<T>(key: keyof Config, value: T): void {
        return context.sharedStorage.set(prefix + key, value);
    }
}
