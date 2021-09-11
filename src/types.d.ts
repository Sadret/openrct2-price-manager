/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

type OverchargeUmbrellasPolicyOption = "always" | "when it rains" | "never";
type ParkPricePolicyOption = "minimum" | "average" | "maximum";
type ChargePolicyOption = "rides" | "park entry" | "both";

interface Persistence {
    get<T>(key: string, defaultValue: T): T;
    set<T>(key: string, value: T): void;
}

interface Property<T> {
    readonly name: string;
    readonly text: string;
    readonly tooltip: string;
    getValue(): T;
    setValue(value: T): void;
}

interface Config {
    // automatic price management
    automaticPriceManagementEnabled: Property<boolean>;

    // ride price management
    ridePriceManagementEnabled: Property<boolean>;
    freeTransportRidesEnabled: Property<boolean>;
    goodValueEnabled: Property<boolean>;
    lazyTaxEnabled: Property<boolean>;
    lazyTaxFactor: Property<number>;
    unboundPriceEnabled: Property<boolean>;

    // shop price management
    shopPriceManagementEnabled: Property<boolean>;
    overchargeUmbrellasPolicy: Property<OverchargeUmbrellasPolicyOption>;

    // toilet price management
    toiletPriceManagementEnabled: Property<boolean>;
    toiletPrice: Property<number>;

    // park price management
    parkPriceManagementEnabled: Property<boolean>;
    parkPricePolicy: Property<ParkPricePolicyOption>;

    // rct1 charge policy
    rct1ChargePolicy: Property<ChargePolicyOption>;
}

interface PriceManagerSetValueActionArgs {
    type: "setValue";
    key: keyof Config;
    value: any;
}

interface PriceManagerGetValueActionArgs {
    type: "getValue";
    key: keyof Config;
}

interface PriceManagerGetConfigActionArgs {
    type: "getConfig";
}

interface PriceManagerBroadcastValueActionArgs {
    type: "broadcastValue";
    key: keyof Config;
    value: any;
}

interface PriceManagerBroadcastConfigActionArgs {
    type: "broadcastConfig";
    config: {
        [Property in keyof Config]: any;
    };
}

type PriceManagerActionArgs =
    PriceManagerSetValueActionArgs |
    PriceManagerGetValueActionArgs |
    PriceManagerGetConfigActionArgs |
    PriceManagerBroadcastValueActionArgs |
    PriceManagerBroadcastConfigActionArgs;
