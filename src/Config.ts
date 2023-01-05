/*****************************************************************************
 * Copyright (c) 2021-2023 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import Property from "./Property";

export default class Config implements IConfig {

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

    constructor(persistence: Persistence) {

        // automatic price management
        this.automaticPriceManagementEnabled = new Property(
            persistence,
            "automaticPriceManagementEnabled",
            true,
            "Enable automatic daily updates",
            "Automatically updates the prices every in-game day.",
        );

        // ride price management
        this.ridePriceManagementEnabled = new Property(
            persistence,
            "ridePriceManagementEnabled",
            true,
            "Enable ride price management",
            "In scenarios where the guests are charged for each ride, the plug-in manages the prices for all rides and enables the following settings.",
        );
        this.freeTransportRidesEnabled = new Property(
            persistence,
            "freeTransportRidesEnabled",
            false,
            "Make transport rides free",
            "Charges nothing for any transport ride. This includes the Miniature Railway, the (Suspended) Monorail and the (Chair)Lift.",
        );
        this.goodValueEnabled = new Property(
            persistence,
            "goodValueEnabled",
            false,
            "Enable 'Good Value' pricing",
            "Charges only a quarter of the ride value, which makes the guests think that the ride has 'Good Value'.",
        );
        this.lazyTaxEnabled = new Property(
            persistence,
            "lazyTaxEnabled",
            false,
            "Enable lazy tax",
            "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
        );
        this.lazyTaxFactor = new Property(
            persistence,
            "lazyTaxFactor",
            50,
            "",
            "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
        );
        this.priceLimitEnabled = new Property(
            persistence,
            "priceLimitEnabled",
            true,
            "Limit prices to",
            "Limits the ride prices to the given amount. Default is 20.00€/$, which is what can be achieved through OpenRCT2's user interface.",
        );
        this.priceLimit = new Property(
            persistence,
            "priceLimit",
            200,
            "",
            "Limits the ride prices to the given amount. Default is 20.00€/$, which is what can be achieved through OpenRCT2's user interface.",
        );

        // shop price management
        this.shopPriceManagementEnabled = new Property(
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
        this.toiletPriceManagementEnabled = new Property(
            persistence,
            "toiletPriceManagementEnabled",
            true,
            "Enable toilet price management",
            "The plug-in sets the price for all toilets to the given amount.",
        );
        this.toiletPrice = new Property(
            persistence,
            "toiletPrice",
            4,
            "",
            "The plug-in sets the price for all toilets to the given amount.",
        );

        // park price management
        this.parkPriceManagementEnabled = new Property(
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
        this.serverWriteAdminOnly = new Property(
            persistence,
            "serverWriteAdminOnly",
            true,
            "Multiplayer: Player needs admin rights",
            "On a multiplayer server, only players with admin rights are allowed to change the configuration.",
        );
    }

}
