/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import PriceManager from "./PriceManager";

const classification = "price-manager";

export default class ConfigWindow {
    private readonly windowDesc: WindowDesc;

    public constructor(config: Config, priceManager: PriceManager) {
        const width = 320;
        const margin = 5;
        const tab = 13; // checkbox width
        const lineHeight = 14;
        const linePadding = 2;
        const inputWidth = 96;
        const buttonHeight = 2 * lineHeight + linePadding;
        const space = 8;

        let y = 14 + margin; // header height + margin
        function advance(dy: number) {
            const cursor = y;
            y += dy;
            return cursor;
        }

        function label(
            property: Property<any>,
            tabbed = false,
        ): LabelWidget {
            return {
                type: "label",
                x: margin + (tabbed ? tab : 0),
                y: advance(lineHeight + linePadding) + 1,
                width: width - 2 * margin - (tabbed ? tab : 0),
                height: 12,
                text: property.text,
                tooltip: property.tooltip,
            };
        }
        function checkbox(
            property: Property<boolean>,
            tabbed = false,
        ): CheckboxWidget {
            return {
                type: "checkbox",
                name: property.name,
                x: margin + (tabbed ? tab : 0),
                y: advance(lineHeight + linePadding) + 1,
                width: width - 2 * margin - (tabbed ? tab : 0),
                height: 12,
                text: property.text,
                tooltip: property.tooltip,
                isChecked: property.getValue(),
                onChange: isChecked => property.setValue(isChecked),
            };
        }
        function dropdown<T extends string>(
            property: Property<T>,
            items: T[],
        ): DropdownWidget {
            return {
                type: "dropdown",
                name: property.name,
                x: width - margin - inputWidth,
                y: advance(0) - (lineHeight + linePadding),
                width: inputWidth,
                height: 14,
                tooltip: property.tooltip,
                items: items,
                selectedIndex: items.indexOf(property.getValue()),
                onChange: index => property.setValue(items[index]),
            };
        }
        function spinner(
            property: Property<number>,
            label: (value: any) => string = String,
            min = Number.NEGATIVE_INFINITY,
            max = Number.POSITIVE_INFINITY,
            step = 1,
        ): SpinnerWidget {
            return {
                type: "spinner",
                name: property.name,
                x: width - margin - inputWidth,
                y: advance(0) - (lineHeight + linePadding),
                width: inputWidth,
                height: 14,
                tooltip: property.tooltip,
                text: label(property.getValue()),
                onDecrement: () => {
                    const value = Math.max(min, property.getValue() - step);
                    property.setValue(value);
                    ui.getWindow(classification).findWidget<SpinnerWidget>(property.name).text = label(value);
                },
                onIncrement: () => {
                    const value = Math.min(max, property.getValue() + step);
                    property.setValue(value);
                    ui.getWindow(classification).findWidget<SpinnerWidget>(property.name).text = label(value);
                },
            };
        }
        function button(
            text: string,
            tooltip: string,
            onClick: () => void,
        ): ButtonWidget {
            return {
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

        const widgets: Widget[] = [];
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
            checkbox(config.unboundPriceEnabled, true),
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
            spinner(config.toiletPrice, value => `${Math.floor(value / 10)}.${value % 10}0`, 0, undefined, 1),
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
            button(
                "Update all prices NOW",
                "The plug-in updates the prices immediately, according to the previous settings.",
                priceManager.updatePrices,
            ),
            button(
                "Make all rides FREE",
                "Charges nothing for all rides. Make sure to have ride price management disabled, or else the prices will reset the next day.",
                () => priceManager.updatePrices(true),
            ),
        );

        this.windowDesc = {
            classification: classification,
            width: width,
            height: y - linePadding + margin,
            title: "Price Manager",
            widgets: widgets,
        };
    }

    public show() {
        const window = ui.getWindow(classification);
        if (window)
            window.bringToFront();
        else
            ui.openWindow(this.windowDesc);
    }
}
