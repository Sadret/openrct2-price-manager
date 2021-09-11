/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

export default class Property<T>{
    private readonly persistence: Persistence;
    readonly name: string;
    private value: T;
    readonly text: string;
    readonly tooltip: string;
    constructor(
        persistence: Persistence,
        name: string,
        defaultValue: T,
        text: string,
        tooltip: string,
    ) {
        this.persistence = persistence;
        this.name = name;
        this.value = this.persistence.get(this.name, defaultValue);
        this.text = text;
        this.tooltip = tooltip;
    }
    getValue(): T {
        return this.value;
    }
    setValue(value: T): void {
        this.value = value;
        this.persistence.set(this.name, value);
    }
};
