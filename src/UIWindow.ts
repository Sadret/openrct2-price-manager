/*****************************************************************************
 * Copyright (c) 2021-2023 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import Server from "./Server";

export default class UIWindow {
    private static readonly classification = "price-manager";

    private readonly windowDesc: WindowDesc;
    private readonly config: IConfig;

    public constructor(config: IConfig, priceManager: IPriceManager) {
        this.config = config;

        const width = 320;
        const margin = 5;
        const tab = 13; // checkbox width
        const lineHeight = 14;
        const linePadding = 2;
        const inputWidth = 96;
        const buttonHeight = 2 * lineHeight + linePadding;
        const space = 16;

        let y = 14 + margin; // header height + margin
        function advance(dy: number) {
            const cursor = y;
            y += dy;
            return cursor;
        }

        function apply<T extends Widget>(name: string, action: (widget: T) => void): void {
            const window = ui.getWindow(UIWindow.classification);
            if (window)
                action(window.findWidget<T>(name));
        }

        function label(
            observable: Observable<any>,
            tabbed = false,
        ): LabelDesc {
            return {
                type: "label",
                name: observable.name + "_label",
                x: margin + (tabbed ? tab : 0),
                y: advance(lineHeight + linePadding) + 1,
                width: width - 2 * margin - (tabbed ? tab : 0),
                height: 12,
                text: observable.text,
                tooltip: observable.tooltip,
            };
        }
        function checkbox(
            observable: Observable<boolean>,
            tabbed = false,
        ): CheckboxDesc {
            const desc: CheckboxDesc = {
                type: "checkbox",
                name: observable.name,
                x: margin + (tabbed ? tab : 0),
                y: advance(lineHeight + linePadding) + 1,
                width: width - 2 * margin - (tabbed ? tab : 0),
                height: 12,
                text: observable.text,
                tooltip: observable.tooltip,
                isChecked: observable.getValue(),
                onChange: isChecked => observable.setValue(isChecked),
            };
            observable.observeValue(value => {
                desc.isChecked = value;
                apply<CheckboxWidget>(observable.name, checkbox => checkbox.isChecked = value);
            });
            return desc;
        }
        function dropdown<T extends string>(
            observable: Observable<T>,
            items: T[],
        ): DropdownDesc {
            const desc: DropdownDesc = {
                type: "dropdown",
                name: observable.name,
                x: width - margin - inputWidth,
                y: advance(0) - (lineHeight + linePadding),
                width: inputWidth,
                height: 14,
                tooltip: observable.tooltip,
                items: items,
                selectedIndex: items.indexOf(observable.getValue()),
                onChange: index => observable.setValue(items[index]),
            };
            observable.observeValue(value => {
                const idx = items.indexOf(value);
                desc.selectedIndex = idx;
                apply<DropdownWidget>(observable.name, dropdown => dropdown.selectedIndex = idx);
            });
            return desc;
        }
        function spinner(
            observable: Observable<number>,
            label: (value: any) => string = String,
            min = Number.NEGATIVE_INFINITY,
            max = Number.POSITIVE_INFINITY,
            step = 1,
        ): SpinnerDesc {
            const desc: SpinnerDesc = {
                type: "spinner",
                name: observable.name,
                x: width - margin - inputWidth,
                y: advance(0) - (lineHeight + linePadding),
                width: inputWidth,
                height: 14,
                tooltip: observable.tooltip,
                text: label(observable.getValue()),
                onDecrement: () => {
                    const value = Math.max(min, observable.getValue() - step);
                    observable.setValue(value);
                },
                onIncrement: () => {
                    const value = Math.min(max, observable.getValue() + step);
                    observable.setValue(value);
                },
            };
            observable.observeValue(value => {
                const text = label(value);
                desc.text = text;
                apply<SpinnerWidget>(observable.name, spinner => spinner.text = text);
            });
            return desc;
        }
        function button(
            name: string,
            text: string,
            tooltip: string,
            onClick: () => void,
        ): ButtonDesc {
            return {
                name: name,
                type: "button",
                x: margin,
                y: advance(buttonHeight + linePadding),
                width: width - 2 * margin,
                height: buttonHeight,
                text: text,
                tooltip: tooltip,
                onClick: onClick,
            };
        }

        const widgets: WidgetDesc[] = [];
        widgets.push(
            checkbox(config.automaticPriceManagementEnabled),
        );
        advance(space);
        widgets.push(
            checkbox(config.ridePriceManagementEnabled),
            checkbox(config.freeTransportRidesEnabled, true),
            checkbox(config.goodValueEnabled, true),
            checkbox(config.lazyTaxEnabled, true),
            spinner(config.lazyTaxFactor, value => value + "%", 0, 100, 5),
            label(config.priceLimit, true),
            spinner(config.priceLimit, value => context.formatString("{CURRENCY2DP}", value), 0, 200, 10),
        );
        advance(space);
        widgets.push(
            checkbox(config.shopPriceManagementEnabled),
            label(config.overchargeUmbrellasPolicy, true),
            dropdown(config.overchargeUmbrellasPolicy, ["always", "when it rains", "never"]),
        );
        advance(space);
        widgets.push(
            checkbox(config.toiletPriceManagementEnabled),
            spinner(config.toiletPrice, value => context.formatString("{CURRENCY2DP}", value), 0, undefined, 1),
        );
        advance(space);
        widgets.push(
            checkbox(config.parkPriceManagementEnabled),
            label(config.parkPricePolicy, true),
            dropdown(config.parkPricePolicy, ["minimum", "average", "maximum"]),
        );
        advance(space);
        widgets.push(
            label(config.rct1ChargePolicy),
            dropdown(config.rct1ChargePolicy, ["rides", "park entry", "both"]),
        );
        advance(space);
        widgets.push(
            checkbox(config.serverWriteAdminOnly),
        );
        advance(space);
        widgets.push(
            button(
                "updatePrices",
                "Update all prices NOW",
                "The plug-in updates the prices immediately, according to the previous settings.",
                () => priceManager.updatePrices(),
            ),
            button(
                "makeRidesFree",
                "Make all rides FREE",
                "Charges nothing for all rides. Make sure to have ride price management disabled, or else the prices will reset the next day.",
                () => priceManager.updatePrices(true),
            ),
        );

        this.windowDesc = {
            classification: UIWindow.classification,
            width: width,
            height: y - linePadding + margin,
            title: "Price Manager",
            widgets: widgets,
        };

        if (network.mode !== "none") {
            config.serverWriteAdminOnly.observeValue(() => this.updateAuthorisation());
            context.subscribe("action.execute", event => {
                if (event.action === "playersetgroup")
                    this.updateAuthorisation();
            });
            this.updateAuthorisation();
        }
    }

    private updateAuthorisation(): void {
        const disabled = !Server.isWriteAuthorized(network.currentPlayer, this.config);
        const admin = Server.isAdmin(network.currentPlayer);
        const window = ui.getWindow(UIWindow.classification);

        this.windowDesc.widgets?.forEach(widget => {
            if (widget.name === "serverWriteAdminOnly") {
                widget.isDisabled = !admin;
                if (window && widget.name)
                    window.findWidget(widget.name).isDisabled = !admin;
            } else {
                widget.isDisabled = disabled;
                if (window && widget.name)
                    window.findWidget(widget.name).isDisabled = disabled;
            }
        });
    }

    public show(): void {
        const window = ui.getWindow(UIWindow.classification);
        if (window)
            window.bringToFront();
        else
            ui.openWindow(this.windowDesc);
    }
}
