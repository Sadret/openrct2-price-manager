/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import Property from "./Property";

function getConfig(persistence: Persistence): Config {
    return {
        // automatic price management
        automaticPriceManagementEnabled: new Property<boolean>(
            persistence,
            "automaticPriceManagementEnabled",
            true,
            "Enable automatic daily updates",
            "Automatically updates the prices every in-game day.",
        ),
        // ride price management
        ridePriceManagementEnabled: new Property(
            persistence,
            "ridePriceManagementEnabled",
            true,
            "Enable ride price management",
            "In scenarios where the guests are charged for each ride, the plug-in manages the prices for all rides and enables the following settings.",
        ),
        freeTransportRidesEnabled: new Property(
            persistence,
            "freeTransportRidesEnabled",
            false,
            "Make transport rides free",
            "Charges nothing for any transport ride. This includes the Miniature Railway, the (Suspended) Monorail and the (Chair)Lift.",
        ),
        goodValueEnabled: new Property(
            persistence,
            "goodValueEnabled",
            false,
            "Enable 'Good Value' pricing",
            "Charges only a quarter of the ride value, which makes the guests think that the ride has 'Good Value'.",
        ),
        lazyTaxEnabled: new Property(
            persistence,
            "lazyTaxEnabled",
            false,
            "Enable lazy tax",
            "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
        ),
        lazyTaxFactor: new Property(
            persistence,
            "lazyTaxFactor",
            50,
            "",
            "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
        ),
        unboundPriceEnabled: new Property(
            persistence,
            "unboundPriceEnabled",
            false,
            "Allow unbound prices",
            "Disables the ride price's upper bound (20.00€/$) that is due to OpenRCT2's user interface.",
        ),
        // shop price management
        shopPriceManagementEnabled: new Property(
            persistence,
            "shopPriceManagementEnabled",
            true,
            "Enable shop price management",
            "The plug-in manages the prices for all shops and all on-ride photos, and enables the following setting.",
        ),
        overchargeUmbrellasPolicy: new Property<OverchargeUmbrellasPolicyOption>(
            persistence,
            "overchargeUmbrellasPolicy",
            "never",
            "Overcharge for umbrellas",
            "Sets the price for umbrellas to 20.00€/$, which guests are always willing to pay when it rains.",
        ),
        // toilet price management
        toiletPriceManagementEnabled: new Property(
            persistence,
            "toiletPriceManagementEnabled",
            true,
            "Enable toilet price management",
            "The plug-in sets the price for all toilets to the given amount.",
        ),
        toiletPrice: new Property(
            persistence,
            "toiletPrice",
            4,
            "",
            "The plug-in sets the price for all toilets to the given amount.",
        ),
        // park price management
        parkPriceManagementEnabled: new Property(
            persistence,
            "parkPriceManagementEnabled",
            true,
            "Enable park fee management",
            "In scenarios where the guests are charged for park entrance, the plug-in manages the park entrance fee and enables the following setting.",
        ),
        parkPricePolicy: new Property<ParkPricePolicyOption>(
            persistence,
            "parkPricePolicy",
            "minimum",
            "Bound by ... initial guest cash",
            "The park entrance fee is bound by the minimum, average, or maximum initial guest cash.",
        ),
        // rct1 charge policy
        rct1ChargePolicy: new Property<ChargePolicyOption>(
            persistence,
            "rct1ChargePolicy",
            "rides",
            "RCT1: Charge for",
            "In RCT1-scenarios, the guests will be charged for rides, park entry, or both.",
        ),
    };
}

const prefix = "price_manager.";
export default {
    getLocalConfig: () => getConfig({
        get: (key, defaultValue) => context.sharedStorage.get(prefix + key, defaultValue),
        set: (key, value) => context.sharedStorage.set(prefix + key, value),
    }),
    getRemoteConfig: () => getConfig({
        get: (_key, defaultValue) => defaultValue,
        set: (_key, _value) => { },
    }),
};
