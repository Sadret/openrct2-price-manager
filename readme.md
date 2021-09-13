# OpenRCT2 Price Manager

An OpenRCT2 plug-in that manages and automatically updates prices for park entry, rides and shops.

## Acknowledgements

This plug-in is based on the famous [Ride Price Manager](https://github.com/mgovea/openrct2-ride-price-manager) of [mgovea](https://github.com/mgovea).

## Features

- Automatic daily updates
- Manage ride prices
  - Make transport rides free
  - 'Good Value' pricing
  - Lazy tax
  - Limit prices to a custom value
- Manage shop prices
  - Overcharge for umbrellas
- Manage toilet prices
- Manage park fees
  - Bound park fee by initial guest cash
- RCT1: Charge for rides, park entry or both
- Make all rides free
- Full multiplayer support

## Installation

1. Make sure that your OpenRCT2 version is up-to-date. You need at least version `0.3.4` or a recent development version.
2. Go to the [releases](https://github.com/Sadret/openrct2-price-manager/releases) page and download the `openrct2-price-manager-?.?.?.js` file from the latest release, where `?.?.?` is the version number. Save it in the `plugin` subfolder of your OpenRCT2 user directory.\
On Windows, this is usually at `C:Users\{User}\Documents\OpenRCT2\plugin`.
3. Start OpenRCT2 and open a scenario.

## Usage

The plug-in will start working without further ado. To open the settings window, click on "Price Manager" in the map menu in the upper toolbar of OpenRCT2. There you can fine-tune the behavior of the Price Manager or disable it altogether.

#### Multiplayer

The Price Manager works in multiplayer games if and only if the server has the plug-in installed. There is no need for the connecting clients to have the plug-in installed.\
Each user will be able to open the settings window, but you can restrict the right to change settings to admins.

## Settings

- **Enable automatic daily updates**: Automatically updates the prices every in-game day.
- **Enable ride price management**: In scenarios where the guests are charged for each ride, the plug-in manages the prices for all rides and enables the following settings:
  - **Make transport rides free**: Charges nothing for any transport ride. This includes the Miniature Railway, the (Suspended) Monorail and the (Chair)Lift.
  - **Enable 'Good Value' pricing**: Charges only a quarter of the ride value, which makes the guests think that the ride has 'Good Value'.
  - **Enable lazy tax**: Reduces the ride prices by the given amount, to balance the vast advantage that the plug-in provides.
  - **Limit prices**: Limits the ride prices to the given amount. Default is 20.00€/$, which is what can be achieved through OpenRCT2's user interface.
- **Enable shop price management**: The plug-in manages the prices for all shops and all on-ride photos, and enables the following setting:
  - **Overcharge for umbrellas**: Sets the price for umbrellas to 20.00€/$, which guests are always willing to pay when it rains.
- **Enable toilet price management**: The plug-in sets the price for all toilets to the given amount.
- **Enable park fee management**: In scenarios where the guests are charged for park entrance, the plug-in manages the park entrance fee and enables the following setting:
  - **Bound by ... initial guest cash**: The park entrance fee is bound by the minimum, average, or maximum initial guest cash.
- **RCT1: Charge for**: In RCT1-scenarios, the guests will be charged for rides, park entry, or both.
- **Multiplayer: Player needs admin rights**: On a multiplayer server, only players with admin rights are allowed to change the configuration.
- **Update all prices NOW**: The plug-in updates the prices immediately, according to the previous settings.
- **Make all rides FREE**: Charges nothing for all rides. Make sure to have ride price management disabled, or else the prices will reset the next day.

## Known Problems

- None.

## Planned Features

- Whatever you propose.

Subscribe to my YouTube channel to learn about upcoming features:
[Sadret Gaming](https://www.youtube.com/channel/UCLF2DGVDbo_Od5K4MeGNTRQ/)

## Support Me

If you find any bugs or if you have any ideas for improvements, you can open an issue on GitHub or contact me on Discord: Sadret#2502.

If you like this plug-in, please leave a star on GitHub.

If you really want to support me, you can [buy me a coffee](https://www.BuyMeACoffee.com/SadretGaming).

## Copyright and License

Copyright (c) 2021 Sadret\
The OpenRCT2 plug-in "Price Manager" is licensed under the GNU General Public License version 3.
