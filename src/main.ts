/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

/// <reference path="../../openrct2.d.ts" />
/// <reference path="types.d.ts" />

import { ACTION } from "./Globals";
import Client from "./Client";
import Config from "./Config";
import LocalPersistence from "./LocalPersistence";
import PriceManager from "./PriceManager";
import RemotePersistence from "./RemotePersistence";
import Server from "./Server";
import UIWindow from "./UIWindow";

registerPlugin({
    name: "price-manager",
    version: "1.1.0",
    authors: ["Sadret"],
    type: "remote",
    licence: "GPL-3.0",
    minApiVersion: 30,
    main: () => {
        if (network.mode !== "none")
            context.registerAction(
                ACTION,
                () => ({}),
                () => ({}),
            );

        const persistence = network.mode === "client" ? new RemotePersistence() : new LocalPersistence();
        const config = new Config(persistence);

        const priceManager = network.mode === "client" ? new Client(config) : new PriceManager(config);

        if (network.mode === "server")
            new Server(config, priceManager);
        if (typeof ui !== "undefined") {
            const window = new UIWindow(config, priceManager);
            ui.registerMenuItem("Price Manager", () => window.show());
        }
    },
});
