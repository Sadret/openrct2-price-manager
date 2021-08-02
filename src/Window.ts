/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import Config, { Property } from "./Config";

import PriceManager from "./PriceManager";

export default { show };

const classification = "price-manager";

function show(): void {
    const window = ui.getWindow(classification);
    if (window)
        return window.bringToFront();

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
            isChecked: property.get(),
            onChange: isChecked => property.set(isChecked),
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
            selectedIndex: items.indexOf(property.get()),
            onChange: index => property.set(items[index]),
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
            text: label(property.get()),
            onDecrement: () => {
                const value = Math.max(min, property.get() - step);
                property.set(value);
                ui.getWindow(classification).findWidget<SpinnerWidget>(property.name).text = label(value);
            },
            onIncrement: () => {
                const value = Math.min(max, property.get() + step);
                property.set(value);
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
        checkbox(Config.automaticPriceManagementEnabled),
    );
    advance(space);
    widgets.push(
        checkbox(Config.ridePriceManagementEnabled),
        checkbox(Config.freeTransportRidesEnabled, true),
        checkbox(Config.goodValueEnabled, true),
        checkbox(Config.lazyTaxEnabled, true),
        spinner(Config.lazyTaxFactor, value => value + "%", 0, 100, 5),
        checkbox(Config.unboundPriceEnabled, true),
    );
    advance(space);
    widgets.push(
        checkbox(Config.shopPriceManagementEnabled),
        label(Config.overchargeUmbrellasPolicy, true),
        dropdown(Config.overchargeUmbrellasPolicy, ["always", "when it rains", "never"]),
    );
    advance(space);
    widgets.push(
        checkbox(Config.toiletPriceManagementEnabled),
        spinner(Config.toiletPrice, value => `${Math.floor(value / 10)}.${value % 10}0`, 0, undefined, 1),
    );
    advance(space);
    widgets.push(
        checkbox(Config.parkPriceManagementEnabled),
        label(Config.parkPricePolicy, true),
        dropdown(Config.parkPricePolicy, ["minimum", "average", "maximum"]),
    );
    advance(space);
    widgets.push(
        label(Config.rct1ChargePolicy),
        dropdown(Config.rct1ChargePolicy, ["rides", "park entry", "both"]),
    );
    advance(space);
    widgets.push(
        button(
            "Update all prices NOW",
            "The plug-in updates the prices immediately, according to the previous settings.",
            PriceManager.updatePrices,
        ),
        button(
            "Make all rides FREE",
            "Charges nothing for all rides. Make sure to have ride price management disabled, or else the prices will reset the next day.",
            () => PriceManager.updatePrices(true),
        ),
    );

    const windowDesc: WindowDesc = {
        classification: classification,
        width: width,
        height: y - linePadding + margin,
        title: "Price Manager",
        widgets: widgets,
    };
    ui.openWindow(windowDesc);
}
