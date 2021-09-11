/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

/// <reference path="../../openrct2.d.ts" />
/// <reference path="types.d.ts" />

import ConfigWindow from "./ConfigWindow";
import Configuration from "./Configuration";
import PriceManager from "./PriceManager";

registerPlugin({
    name: "price-manager",
    version: "1.0.0",
    authors: ["Sadret"],
    type: "remote",
    licence: "GPL-3.0",
    minApiVersion: 30,
    main: () => {
        const config = Configuration.getLocalConfig();
        const priceManager = new PriceManager(config);

        if (typeof ui !== "undefined") {
            const configWindow = new ConfigWindow(config, priceManager);
            ui.registerMenuItem("Price Manager", () => configWindow.show());
        }

        context.subscribe("interval.day", () => {
            if (config.automaticPriceManagementEnabled.getValue())
                priceManager.updatePrices();
        });

        if (config.automaticPriceManagementEnabled.getValue())
            priceManager.updatePrices();
    },
});
