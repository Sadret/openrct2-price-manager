/*****************************************************************************
 * Copyright (c) 2021-2023 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

export interface Persistence {
    get<T>(key: string, defaultValue: T): T;
    set<T>(key: string, value: T): void;
}

export interface PriceManager {
    updatePrices(makeRidesFree?: boolean): void;
}

export type SetValueActionArgs = {
    readonly type: "setValue";
    readonly key: string;
    readonly value: any;
};

export type GetValueActionArgs = {
    readonly type: "getValue";
    readonly key: string;
};

export type BroadcastValueActionArgs = {
    readonly type: "broadcastValue";
    readonly key: string;
    readonly value: any;
};

export type UpdatePricesActionArgs = {
    readonly type: "updatePrices";
    readonly makeRidesFree: boolean;
};

export type PriceManagerActionArgs =
    SetValueActionArgs |
    GetValueActionArgs |
    BroadcastValueActionArgs |
    UpdatePricesActionArgs;