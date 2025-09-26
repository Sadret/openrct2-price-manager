/*****************************************************************************
 * Copyright (c) 2021-2023 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import type { Persistence } from "./types";

export type Observer<T> = (value: T) => void;

export default class Property<T> {
    readonly persistence: Persistence;
    readonly name: string;
    private value: T;
    readonly text: string;
    readonly tooltip: string;

    private readonly observers: Observer<T>[] = [];

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
        if (this.value === value)
            return;

        this.value = value;
        this.persistence.set(this.name, value);
        this.observers.forEach(observer => observer(value));
    }

    observeValue(observer: Observer<T>): void {
        this.observers.push(observer);
    }
};
