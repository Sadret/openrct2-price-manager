/*****************************************************************************
 * Copyright (c) 2021-2025 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import { PLUGIN_NAME } from "./Globals";
import Property from "./Property";
import type { Persistence } from "./types";

type OverchargeUmbrellasPolicyOption = "always" | "when it rains" | "never";
type ParkPricePolicyOption = "minimum" | "average" | "maximum";
type ChargePolicyOption = "rides" | "park entry" | "both";

export default class Config {

    // automatic price management
    readonly automaticPriceManagementEnabled: Property<boolean>;

    // ride price management
    readonly ridePriceManagementEnabled: Property<boolean>;
    readonly freeTransportRidesEnabled: Property<boolean>;
    readonly keepFreeRidesFreeEnabled: Property<boolean>;
    readonly goodValueEnabled: Property<boolean>;
    readonly lazyTaxEnabled: Property<boolean>;
    readonly lazyTaxFactor: Property<number>;
    readonly priceLimit: Property<number>;

    // shop price management
    readonly shopPriceManagementEnabled: Property<boolean>;
    readonly overchargeUmbrellasPolicy: Property<OverchargeUmbrellasPolicyOption>;

    // toilet price management
    readonly toiletPriceManagementEnabled: Property<boolean>;
    readonly toiletPrice: Property<number>;

    // park price management
    readonly parkPriceManagementEnabled: Property<boolean>;
    readonly parkPricePolicy: Property<ParkPricePolicyOption>;

    // rct1 charge policy
    readonly rct1ChargePolicy: Property<ChargePolicyOption>;

    // server
    readonly serverWriteAdminOnly: Property<boolean>;

    constructor(persistence: Persistence) {

        // automatic price management
        this.automaticPriceManagementEnabled = new Property<boolean>(
            persistence,
            "automaticPriceManagementEnabled",
            true,
            "Enable automatic daily updates",
            "Automatically updates the prices every in-game day.",
        );

        // ride price management
        this.ridePriceManagementEnabled = new Property<boolean>(
            persistence,
            "ridePriceManagementEnabled",
            true,
            "Enable ride price management",
            "In scenarios where the guests are charged for each ride, the plug-in manages the prices for all rides and enables the following settings.",
        );
        this.freeTransportRidesEnabled = new Property<boolean>(
            persistence,
            "freeTransportRidesEnabled",
            false,
            "Make transport rides free",
            "Charges nothing for any transport ride. This includes the Miniature Railway, the (Suspended) Monorail and the (Chair)Lift.",
        );
        this.keepFreeRidesFreeEnabled = new Property<boolean>(
            persistence,
            "keepFreeRidesFreeEnabled",
            false,
            "Keep free rides free",
            "Does not change the price of any ride that is currently free to ride.",
        );
        this.goodValueEnabled = new Property<boolean>(
            persistence,
            "goodValueEnabled",
            false,
            "Enable 'Good Value' pricing",
            "Charges only a quarter of the ride value, which makes the guests think that the ride has 'Good Value'.",
        );
        this.lazyTaxEnabled = new Property<boolean>(
            persistence,
            "lazyTaxEnabled",
            false,
            "Enable lazy tax",
            "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
        );
        this.lazyTaxFactor = new Property<number>(
            persistence,
            "lazyTaxFactor",
            50,
            "",
            "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
        );
        this.priceLimit = new Property<number>(
            persistence,
            "priceLimit",
            200,
            "Limit prices to",
            "Limits the ride prices to the given amount. Default is " + context.formatString("{CURRENCY2DP}", 200) + ", which is the maximum you can charge in OpenRCT2.",
        );
        // limit ride prices to 20 GBP
        if (this.priceLimit.getValue() > 200)
            this.priceLimit.setValue(200);

        // shop price management
        this.shopPriceManagementEnabled = new Property<boolean>(
            persistence,
            "shopPriceManagementEnabled",
            true,
            "Enable shop price management",
            "The plug-in manages the prices for all shops and all on-ride photos, and enables the following setting.",
        );
        this.overchargeUmbrellasPolicy = new Property<OverchargeUmbrellasPolicyOption>(
            persistence,
            "overchargeUmbrellasPolicy",
            "never",
            "Overcharge for umbrellas",
            "Sets the price for umbrellas to 20.00€/$, which guests are always willing to pay when it rains.",
        );

        // toilet price management
        this.toiletPriceManagementEnabled = new Property<boolean>(
            persistence,
            "toiletPriceManagementEnabled",
            true,
            "Enable toilet price management",
            "The plug-in sets the price for all toilets to the given amount.",
        );
        this.toiletPrice = new Property<number>(
            persistence,
            "toiletPrice",
            4,
            "",
            "The plug-in sets the price for all toilets to the given amount.",
        );

        // park price management
        this.parkPriceManagementEnabled = new Property<boolean>(
            persistence,
            "parkPriceManagementEnabled",
            true,
            "Enable park fee management",
            "In scenarios where the guests are charged for park entrance, the plug-in manages the park entrance fee and enables the following setting.",
        );
        this.parkPricePolicy = new Property<ParkPricePolicyOption>(
            persistence,
            "parkPricePolicy",
            "minimum",
            "Bound by ... initial guest cash",
            "The park entrance fee is bound by the minimum, average, or maximum initial guest cash.",
        );

        // rct1 charge policy
        this.rct1ChargePolicy = new Property<ChargePolicyOption>(
            persistence,
            "rct1ChargePolicy",
            "rides",
            "RCT1: Charge for",
            "In RCT1-scenarios, the guests will be charged for rides, park entry, or both.",
        );

        // server write admin only
        this.serverWriteAdminOnly = new Property<boolean>(
            persistence,
            "serverWriteAdminOnly",
            true,
            "Multiplayer: Player needs admin rights",
            "On a multiplayer server, only players with admin rights are allowed to change the configuration.",
        );
    }

    public saveAsDefault(): void {
        Object.keys(this).map(
            key => this[key as keyof this]
        ).filter(
            attr => attr instanceof Property
        ).forEach(
            prop => context.sharedStorage.set(`${PLUGIN_NAME}.${prop.name}`, prop.getValue())
        );
    }
}
