/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import PriceManager from "./PriceManager";

const classification = "price-manager";

export default class ConfigWindow {
    public static show(config: Config, priceManager: PriceManager) {
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

        function apply<T extends Widget>(name: string, action: (widget: T) => void): void {
            const window = ui.getWindow(classification);
            if (window)
                action(window.findWidget<T>(name));
        }

        function label(
            observable: Observable<any>,
            tabbed = false,
        ): LabelWidget {
            return {
                type: "label",
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
        ): CheckboxWidget {
            observable.observeValue(value =>
                apply<CheckboxWidget>(observable.name, checkbox => checkbox.isChecked = value)
            );
            return {
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
        }
        function dropdown<T extends string>(
            observable: Observable<T>,
            items: T[],
        ): DropdownWidget {
            observable.observeValue(value =>
                apply<DropdownWidget>(observable.name, dropdown => dropdown.selectedIndex = items.indexOf(value))
            );
            return {
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
        }
        function spinner(
            observable: Observable<number>,
            label: (value: any) => string = String,
            min = Number.NEGATIVE_INFINITY,
            max = Number.POSITIVE_INFINITY,
            step = 1,
        ): SpinnerWidget {
            observable.observeValue(value =>
                apply<SpinnerWidget>(observable.name, spinner => spinner.text = label(value))
            );
            return {
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
                () => priceManager.updatePrices(),
            ),
            button(
                "Make all rides FREE",
                "Charges nothing for all rides. Make sure to have ride price management disabled, or else the prices will reset the next day.",
                () => priceManager.updatePrices(true),
            ),
        );

        const windowDesc = {
            classification: classification,
            width: width,
            height: y - linePadding + margin,
            title: "Price Manager",
            widgets: widgets,
        };
        ui.openWindow(windowDesc);
    }
}
