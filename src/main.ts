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
import Server from "./Server";

const actionName = "price-manager-action";

registerPlugin({
    name: "price-manager",
    version: "1.0.0",
    authors: ["Sadret"],
    type: "remote",
    licence: "GPL-3.0",
    minApiVersion: 30,
    main: () => {
        if (network.mode !== "none")
            context.registerAction(
                actionName,
                () => ({}),
                () => ({}),
            );

        const config = new Configuration(network.mode === "client");

        if (network.mode === "server")
            new Server(config);

        if (network.mode !== "client")
            new PriceManager(config);

        if (typeof ui !== "undefined")
            ui.registerMenuItem("Price Manager", () => ConfigWindow.show(config, <any>undefined));
    },
});
