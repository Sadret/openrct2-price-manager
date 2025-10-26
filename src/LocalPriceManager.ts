/*****************************************************************************
 * Copyright (c) 2021-2025 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type Config from "./Config";
import ShopItem from "./ShopItem";
import type { PriceManager } from "./types";

export default class LocalPriceManager implements PriceManager {
    private readonly config: Config;

    public constructor(config: Config) {
        this.config = config;

        context.subscribe("interval.day", () => {
            if (config.automaticPriceManagementEnabled.getValue())
                this.updatePrices();
        });

        if (config.automaticPriceManagementEnabled.getValue())
            this.updatePrices();
    }

    public updatePrices(makeRidesFree: boolean = false): void {
        if (park.getFlag("noMoney"))
            return;

        // park price management
        this.updateParkPrice();

        // ride and shop price management
        map.rides.forEach(
            (ride: Ride) => this.updatePrice(ride, makeRidesFree)
        );

        // re-run park price management after ride value recalculation
        // this happens together with guest softcap recalculation
        const callback = context.subscribe("park.guest.softcap.calculate", () => {
            callback.dispose();
            this.updateParkPrice();
        });
    }

    private setParkPrice(value: number): void {
        context.executeAction(
            "parksetentrancefee",
            {
                value: value,
            },
            () => { },
        );
    }

    private setRidePrice(ride: Ride, price: number, isPrimaryPrice: boolean): void {
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

    private isParkFree(): boolean {
        return false
            // Scenario does not allow charging for park entry.
            || park.getFlag("freeParkEntry")
            // RCT1 allows charging for both the park entry and rides.
            || park.getFlag("unlockAllPrices") && this.config.rct1ChargePolicy.getValue() === "rides";
    }

    private updateParkPrice(): void {
        if (!this.config.parkPriceManagementEnabled.getValue())
            return;

        this.setParkPrice(
            this.isParkFree()
                ? 0
                : Math.min(park.totalRideValueForMoney, this.getMaximumParkEntranceFee())
        );
    }

    private updatePrice(ride: Ride, makeRidesFree: boolean): void {
        if (ride.price.length === 0)
            return;
        if (ride.classification === "ride")
            this.updateRidePrice(ride, makeRidesFree);
        else
            this.updateShopPrice(ride, true);
        if (ride.price.length > 1)
            this.updateShopPrice(ride, false);
    }

    private updateRidePrice(ride: Ride, makeFree: boolean): void {
        if (!this.config.ridePriceManagementEnabled.getValue())
            return;

        // Ignore unrated rides.
        if (ride.excitement < 0)
            return;

        const price = makeFree ? 0 : this.calculateRidePrice(ride);
        this.setRidePrice(ride, price, true);
    }

    private updateShopPrice(ride: Ride, isPrimaryPrice: boolean): void {
        // Toilets.
        if (ride.type === 36)
            if (this.config.toiletPriceManagementEnabled.getValue())
                return this.setRidePrice(ride, this.config.toiletPrice.getValue(), isPrimaryPrice)
            else
                return;

        // Everything else but toilets.
        if (!this.config.shopPriceManagementEnabled.getValue())
            return;

        const price = ShopItem.getItemPrice(isPrimaryPrice ? ride.object.shopItem : ride.object.shopItemSecondary, this.config);
        this.setRidePrice(ride, price, isPrimaryPrice);
    }

    private calculateRidePrice(ride: Ride): number {
        // Scenario does not allow charging for rides.
        if (!park.getFlag("freeParkEntry") && !park.getFlag("unlockAllPrices"))
            return 0;

        // RCT1 allows charging for both the park entry and rides.
        if (park.getFlag("unlockAllPrices") && this.config.rct1ChargePolicy.getValue() === "park entry")
            return 0;

        // Make transport rides free.
        if (this.config.freeTransportRidesEnabled.getValue() && [5, 6, 18, 43, 63].indexOf(ride.type) !== -1)
            return 0;

        // Keep free rides free.
        if (this.config.keepFreeRidesFreeEnabled.getValue() && ride.price[0] === 0)
            return 0;

        // Guests only pay a quarter if they had to pay for park entry
        const value = ride.value >> (this.isParkFree() ? 0 : 2);

        // Guests will pay at most double the value
        // If it is less than half, they think it is good value
        let price = this.config.goodValueEnabled.getValue() ? value >> 1 : value << 1;

        if (this.config.lazyTaxEnabled.getValue())
            price = Math.floor(price * (1 - this.config.lazyTaxFactor.getValue() / 100));

        // Limit the price
        price = Math.min(price, this.config.priceLimit.getValue());

        return price;
    }

    private getMaximumParkEntranceFee(): number {
        switch (this.config.parkPricePolicy.getValue()) {
            case "minimum":
                return park.guestInitialCash - 100;
            case "average":
                return park.guestInitialCash + 50;
            case "maximum":
                return park.guestInitialCash + 200;
        }
    }
}
