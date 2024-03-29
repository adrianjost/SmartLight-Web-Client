[<img src="./public/img/logo/SmartLight-512.png" width="150" align="right">](http://smartlight.hackedit.de)

# SmartLight Web

![CI](https://github.com/adrianjost/SmartLight-Web-Client/workflows/CI/badge.svg) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/d705c9d8c51c48e185c13b76cb5406b9)](https://www.codacy.com/app/adrianjost/SmartLight-Web-Client?utm_source=github.com&utm_medium=referral&utm_content=adrianjost/SmartLight-Web-Client&utm_campaign=Badge_Grade) [![Dependency Status](https://david-dm.org/adrianjost/SmartLight-Web-Client.svg)](https://david-dm.org/adrianjost/SmartLight-Web-Client) [![Dependency Status](https://david-dm.org/adrianjost/SmartLight-Web-Client/dev-status.svg)](https://david-dm.org/adrianjost/SmartLight-Web-Client?type=dev)

This Repository contains the (Web-) UI for SmartLight as well as the Firebase hosted Backend Code.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# deploy to firebase
npm deploy
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Environment Variables

| Variable | Description |
| --- | --- |
| `VUE_APP_SENTRY_DSN` | SENTRY DSN URL - if defined, sentry is enabled and will report all errors |

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
  lamptype: String, // ["RGB", "WWCW"]

  id: String,
  name: String,
  icon: String,

  state: { // only one child at a time allowed
    color: String, // #aabbcc
    type: String // ["OFF", "MANUAL", "AUTO"]
  }
}
```

##### extension for lamps

```js
{
  ...
  ip: String,
  hostname: String,
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
  type: ENUM["COLOR"],
}
```

##### ColorObject

```js
{
  ...,
  color: String // Hex color with 6 digits + `#` Symbol (e.g. `#ab98cd`)
}
```
