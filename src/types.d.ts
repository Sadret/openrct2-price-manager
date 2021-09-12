/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

type OverchargeUmbrellasPolicyOption = "always" | "when it rains" | "never";
type ParkPricePolicyOption = "minimum" | "average" | "maximum";
type ChargePolicyOption = "rides" | "park entry" | "both";

type Observer<T> = (value: T) => void;

interface Observable<T> {
    readonly name: string;
    readonly text: string;
    readonly tooltip: string;
    getValue(): T;
    setValue(value: T): void;
    observeValue(observer: Observer<T>): void;
}

interface Config {
    // automatic price management
    readonly automaticPriceManagementEnabled: Observable<boolean>;

    // ride price management
    readonly ridePriceManagementEnabled: Observable<boolean>;
    readonly freeTransportRidesEnabled: Observable<boolean>;
    readonly goodValueEnabled: Observable<boolean>;
    readonly lazyTaxEnabled: Observable<boolean>;
    readonly lazyTaxFactor: Observable<number>;
    readonly unboundPriceEnabled: Observable<boolean>;

    // shop price management
    readonly shopPriceManagementEnabled: Observable<boolean>;
    readonly overchargeUmbrellasPolicy: Observable<OverchargeUmbrellasPolicyOption>;

    // toilet price management
    readonly toiletPriceManagementEnabled: Observable<boolean>;
    readonly toiletPrice: Observable<number>;

    // park price management
    readonly parkPriceManagementEnabled: Observable<boolean>;
    readonly parkPricePolicy: Observable<ParkPricePolicyOption>;

    // rct1 charge policy
    readonly rct1ChargePolicy: Observable<ChargePolicyOption>;
}

interface Persistence {
    get<T>(key: keyof Config, defaultValue: T): T;
    set<T>(key: keyof Config, value: T): void;
}

interface PriceManagerSetValueActionArgs {
    readonly type: "setValue";
    readonly key: keyof Config;
    readonly value: any;
}

interface PriceManagerGetValueActionArgs {
    readonly type: "getValue";
    readonly key: keyof Config;
}

interface PriceManagerBroadcastValueActionArgs {
    readonly type: "broadcastValue";
    readonly key: keyof Config;
    readonly value: any;
}

type PriceManagerActionArgs =
    PriceManagerSetValueActionArgs |
    PriceManagerGetValueActionArgs |
    PriceManagerBroadcastValueActionArgs;
