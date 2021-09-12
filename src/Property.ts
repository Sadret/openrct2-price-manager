/*****************************************************************************
 * Copyright (c) 2021 Sadret
 *
 * The OpenRCT2 plug-in "Price Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

export default class Property<T> implements Observable<T>{
    readonly persistence: Persistence;
    readonly name: keyof Config;
    private value: T;
    readonly text: string;
    readonly tooltip: string;

    private readonly observers: Observer<T>[] = [];

    constructor(
        persistence: Persistence,
        name: keyof Config,
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
