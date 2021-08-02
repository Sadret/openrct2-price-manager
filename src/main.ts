/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

/// <reference path="../../openrct2.d.ts" />

import Config from "./Config";
import PriceManager from "./PriceManager";
import Window from "./Window";

registerPlugin({
    name: "price-manager",
    version: "1.0.0",
    authors: ["Sadret"],
    type: "local",
    licence: "GPL-3.0",
    minApiVersion: 30,
    main: () => {
        if (typeof ui !== "undefined")
            ui.registerMenuItem("Price Manager", Window.show);

        context.subscribe("interval.day", () => {
            if (Config.automaticPriceManagementEnabled.get())
                PriceManager.updatePrices();
        });

        if (Config.automaticPriceManagementEnabled.get())
            PriceManager.updatePrices();
    },
});
