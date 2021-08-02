/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

type OverchargeUmbrellasPolicyOption = "always" | "when it rains" | "never";
type ParkPricePolicyOption = "minimum" | "average" | "maximum";
type ChargePolicyOption = "rides" | "park entry" | "both";

const configPrefix = "price_manager.";

export class Property<T> {
    readonly name: string;
    private value: T;
    readonly text: string;
    readonly tooltip: string;
    constructor(
        name: string,
        defaultValue: T,
        text: string,
        tooltip: string,
    ) {
        this.name = name;
        this.value = context.sharedStorage.get(configPrefix + this.name, defaultValue);
        this.text = text;
        this.tooltip = tooltip;
    }
    get(): T {
        return this.value;
    }
    set(value: T): void {
        this.value = value;
        context.sharedStorage.set(configPrefix + this.name, value);
    }
}

export default {
    // automatic price management
    automaticPriceManagementEnabled: new Property(
        "automaticPriceManagementEnabled",
        true,
        "Enable automatic daily updates",
        "Automatically updates the prices every in-game day.",
    ),
    // ride price management
    ridePriceManagementEnabled: new Property(
        "ridePriceManagementEnabled",
        true,
        "Enable ride price management",
        "In scenarios where the guests are charged for each ride, the plug-in manages the prices for all rides and enables the following settings.",
    ),
    freeTransportRidesEnabled: new Property(
        "freeTransportRidesEnabled",
        false,
        "Make transport rides free",
        "Charges nothing for any transport ride. This includes the Miniature Railway, the (Suspended) Monorail and the (Chair)Lift.",
    ),
    goodValueEnabled: new Property(
        "goodValueEnabled",
        false,
        "Enable 'Good Value' pricing",
        "Charges only a quarter of the ride value, which makes the guests think that the ride has 'Good Value'.",
    ),
    lazyTaxEnabled: new Property(
        "lazyTaxEnabled",
        false,
        "Enable lazy tax",
        "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
    ),
    lazyTaxFactor: new Property(
        "lazyTaxFactor",
        50,
        "",
        "Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.",
    ),
    unboundPriceEnabled: new Property(
        "unboundPriceEnabled",
        false,
        "Allow unbound prices",
        "Disables the ride price's upper bound (20.00€/$) that is due to OpenRCT2's user interface.",
    ),
    // shop price management
    shopPriceManagementEnabled: new Property(
        "shopPriceManagementEnabled",
        true,
        "Enable shop price management",
        "The plug-in manages the prices for all shops and all on-ride photos, and enables the following setting.",
    ),
    overchargeUmbrellasPolicy: new Property<OverchargeUmbrellasPolicyOption>(
        "overchargeUmbrellasPolicy",
        "never",
        "Overcharge for umbrellas",
        "Sets the price for umbrellas to 20.00€/$, which guests are always willing to pay when it rains.",
    ),
    // toilet price management
    toiletPriceManagementEnabled: new Property(
        "toiletPriceManagementEnabled",
        true,
        "Enable toilet price management",
        "The plug-in sets the price for all toilets to the given amount.",
    ),
    toiletPrice: new Property(
        "toiletPrice",
        4,
        "",
        "The plug-in sets the price for all toilets to the given amount.",
    ),
    // park price management
    parkPriceManagementEnabled: new Property(
        "parkPriceManagementEnabled",
        true,
        "Enable park fee management",
        "In scenarios where the guests are charged for park entrance, the plug-in manages the park entrance fee and enables the following setting.",
    ),
    parkPricePolicy: new Property<ParkPricePolicyOption>(
        "parkPricePolicy",
        "minimum",
        "Bound by ... initial guest cash",
        "The park entrance fee is bound by the minimum, average, or maximum initial guest cash.",
    ),
    // rct1 charge policy
    rct1ChargePolicy: new Property<ChargePolicyOption>(
        "rct1ChargePolicy",
        "rides",
        "RCT1: Charge for",
        "In RCT1-scenarios, the guests will be charged for rides, park entry, or both.",
    ),
};
