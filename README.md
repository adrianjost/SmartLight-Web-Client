[<img src="./public/img/logo/SmartLight-512.png" width="150" align="right">](http://smartlight.ga)

# SmartLight Web

[![Active Contributors](https://api.gitential.com/accounts/1294/projects/1473/badges/active-contributors.svg)](https://gitential.com/accounts/1294/projects/1473/share?uuid=923d642f-dd80-4b4e-9d58-cb42f7242231&utm_source=shield&utm_medium=shield&utm_campaign=1473) [![Code Volume](https://api.gitential.com/accounts/1294/projects/1473/badges/code-volume.svg)](https://gitential.com/accounts/1294/projects/1473/share?uuid=923d642f-dd80-4b4e-9d58-cb42f7242231&utm_source=shield&utm_medium=shield&utm_campaign=1473) [![Coding Hours](https://api.gitential.com/accounts/1294/projects/1473/badges/coding-hours.svg)](https://gitential.com/accounts/1294/projects/1473/share?uuid=923d642f-dd80-4b4e-9d58-cb42f7242231&utm_source=shield&utm_medium=shield&utm_campaign=1473)

**master status:** [![Build Status](https://travis-ci.com/adrianjost/SmartLight-Web-Client.svg?branch=master)](https://travis-ci.com/adrianjost/SmartLight-Web-Client) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/d705c9d8c51c48e185c13b76cb5406b9)](https://www.codacy.com/app/adrianjost/SmartLight-Web-Client?utm_source=github.com&utm_medium=referral&utm_content=adrianjost/SmartLight-Web-Client&utm_campaign=Badge_Grade) [![Greenkeeper badge](https://badges.greenkeeper.io/adrianjost/SmartLight-Web-Client.svg)](https://greenkeeper.io/)

This Repository contains the (Web-) UI for SmartLight as well as the Firebase hosted Backend Code.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report

# deploy to firebase
npm deploy
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Database

### Schema

All Objects that are defined here will be explained in detail below. This is just an overview.

```js
{
  users: {UserObject, ...},
  units: {UnitObject ...},
  states: {StateObject, ...},
}
```

#### UserObject

```js
$userId: {
  apiSeret: String,
}
```

The apiSecret will be used for external API access like used for Google Home integration (via IFTTT).

#### Units

Units are Items that can be controlled. Such Items can eighter be lamps or groups of lamps. The base Schema is the following and will be extended for lamps/groups with a couple more key-value pairs.

```js
$index: {
  created_by: userId,
  //allowedUsers: [userId, ...],

  type: ENUM["LAMP", "GROUP"],

  id: String,
  name: String,
  icon: String,

  state: { // only one child at a time allowed
    color: String, // #aabbcc
    gradient: StateObject
  }
}
```

##### extension for lamps

```js
{
  ...
  ip: String,
  hostname: String,
  lamptype: String,
	channelMap: Object,
}
```

- `lamptype`: `RGB`, `WWCW`, `Switch` ...
- `channelMap`: `{ r: 1, g: 2, b: 3}` with 1, 2 and 3 mixed up

##### extension for groups

```js
{
  ...
  lamps: [LampIds]
}
```

#### StateObject

```js
$index: {
  created_by: userId,
  //allowedUsers: [userId, ...],
  type: ENUM["COLOR", "GRADIENT"],
}
```

##### ColorObject

```js
{
  ...,
  color: String // Hex color with 6 digits + `#` Symbol (e.g. `#ab98cd`)
}
```

##### GradientObject

```js
{
  ...,
  colors: [String, ...], // [#aabbcc, ...]
  transitionTimes: [0, 3, 4, 10], // [#aabbcc, ...]
  loop: true
}
```
