/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import Config from "./Config";
import ShopItem from "./ShopItem";

export default { updatePrices };

function updatePrices(makeRidesFree: boolean = false): void {
    if (park.getFlag("noMoney"))
        return;

    // park price management
    updateParkPrice();

    // ride and shop price management
    map.rides.forEach(
        (ride: Ride) => updatePrice(ride, makeRidesFree)
    );
}

function setParkPrice(value: number): void {
    context.executeAction(
        "setparkentrancefee",
        {
            value: value,
        },
        () => { },
    );
}

function setRidePrice(ride: Ride, price: number, isPrimaryPrice: boolean): void {
    context.executeAction(
        "ridesetprice",
        {
            ride: ride.id,
            price: price,
            isPrimaryPrice: isPrimaryPrice,
        },
        () => { },
    );
}

function updateParkPrice(): void {
    if (!Config.parkPriceManagementEnabled.get())
        return;

    setParkPrice(calculateParkPrice());
}

function calculateParkPrice(): number {
    // Scenario does not allow charging for park entry.
    if (park.getFlag("freeParkEntry"))
        return 0;

    // RCT1 allows charging for both the park entry and rides.
    if (park.getFlag("unlockAllPrices"))
        if (Config.rct1ChargePolicy.get() === "rides")
            return 0;

    return Math.min(park.totalRideValueForMoney, getMaximumParkEntranceFee());
}

function updatePrice(ride: Ride, makeRidesFree: boolean): void {
    if (ride.price.length === 0)
        return;
    if (ride.classification === "ride")
        updateRidePrice(ride, makeRidesFree);
    else
        updateShopPrice(ride, true);
    if (ride.price.length > 1)
        updateShopPrice(ride, false);
}

function updateRidePrice(ride: Ride, makeFree: boolean): void {
    if (!Config.ridePriceManagementEnabled.get())
        return;

    // Ignore unrated rides.
    if (ride.excitement < 0)
        return;

    const price = makeFree ? 0 : calculateRidePrice(ride);
    setRidePrice(ride, price, true);
}

function updateShopPrice(ride: Ride, isPrimaryPrice: boolean): void {
    if (!Config.shopPriceManagementEnabled.get())
        return;

    // Toilets.
    if (ride.type === 36)
        if (Config.toiletPriceManagementEnabled.get())
            return setRidePrice(ride, Config.toiletPrice.get(), isPrimaryPrice);
        else
            return;

    const price = ShopItem.getItemPrice(isPrimaryPrice ? ride.object.shopItem : ride.object.shopItemSecondary);
    setRidePrice(ride, price, isPrimaryPrice);
}

function calculateRidePrice(ride: Ride): number {
    // Scenario does not allow charging for rides.
    if (!park.getFlag("freeParkEntry") && !park.getFlag("unlockAllPrices"))
        return 0;

    // RCT1 allows charging for both the park entry and rides.
    if (park.getFlag("unlockAllPrices"))
        if (Config.rct1ChargePolicy.get() === "park entry")
            return 0;

    // Make transport rides free.
    if (Config.freeTransportRidesEnabled.get() && [5, 6, 18, 43, 63].indexOf(ride.type) !== -1)
        return 0;

    // See /src/openrct2/peep/Guest.cpp for logic.
    // if (peep_flags & PEEP_FLAGS_HAS_PAID_FOR_PARK_ENTRY) value /= 4;
    const value = park.entranceFee > 0 && !park.getFlag("freeParkEntry")
        ? Math.floor(ride.value / 4)
        : ride.value;

    // See /src/openrct2/peep/Guest.cpp for logic.
    // if (ridePrice > value * 2) ChoseNotToGoOnRide
    // if (ridePrice <= value / 2) InsertNewThought(PEEP_THOUGHT_TYPE_GOOD_VALUE)
    let priceInDimes = Config.goodValueEnabled.get()
        ? Math.floor(value / 2)
        : value * 2;

    if (Config.lazyTaxEnabled.get()) {
        priceInDimes *= (1 - Config.lazyTaxFactor.get() / 100);
        priceInDimes = Math.floor(priceInDimes);
    }

    if (!Config.unboundPriceEnabled.get()) {
        // Max price is $20 via the UI.
        priceInDimes = Math.min(priceInDimes, 200);
    }

    return priceInDimes;
}

function getMaximumParkEntranceFee(): number {
    switch (Config.parkPricePolicy.get()) {
        case "minimum":
            return park.guestInitialCash - 100;
        case "average":
            return park.guestInitialCash + 50;
        case "maximum":
            return park.guestInitialCash + 200;
    }
}
