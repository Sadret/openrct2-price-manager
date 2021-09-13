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
    readonly name: keyof IConfig;
    readonly text: string;
    readonly tooltip: string;
    getValue(): T;
    setValue(value: T): void;
    observeValue(observer: Observer<T>): void;
}

interface IConfig {
    // automatic price management
    readonly automaticPriceManagementEnabled: Observable<boolean>;

    // ride price management
    readonly ridePriceManagementEnabled: Observable<boolean>;
    readonly freeTransportRidesEnabled: Observable<boolean>;
    readonly goodValueEnabled: Observable<boolean>;
    readonly lazyTaxEnabled: Observable<boolean>;
    readonly lazyTaxFactor: Observable<number>;
    readonly priceLimitEnabled: Observable<boolean>;
    readonly priceLimit: Observable<number>;

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

    // server
    readonly serverWriteAdminOnly: Observable<boolean>;
}

interface Persistence {
    get<T>(key: keyof IConfig, defaultValue: T): T;
    set<T>(key: keyof IConfig, value: T): void;
}

interface SetValueActionArgs {
    readonly type: "setValue";
    readonly key: keyof IConfig;
    readonly value: any;
}

interface GetValueActionArgs {
    readonly type: "getValue";
    readonly key: keyof IConfig;
}

interface BroadcastValueActionArgs {
    readonly type: "broadcastValue";
    readonly key: keyof IConfig;
    readonly value: any;
}

interface UpdatePricesActionArgs {
    readonly type: "updatePrices";
    readonly makeRidesFree: boolean;
}

type PriceManagerActionArgs =
    SetValueActionArgs |
    GetValueActionArgs |
    BroadcastValueActionArgs |
    UpdatePricesActionArgs;

interface IPriceManager {
    updatePrices(makeRidesFree: boolean = false): void;
}
