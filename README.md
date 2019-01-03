# SmartLight Web
[![Active Contributors](https://api.gitential.com/accounts/1294/projects/1473/badges/active-contributors.svg)](https://gitential.com/accounts/1294/projects/1473/share?uuid=923d642f-dd80-4b4e-9d58-cb42f7242231&utm_source=shield&utm_medium=shield&utm_campaign=1473)
[![Code Volume](https://api.gitential.com/accounts/1294/projects/1473/badges/code-volume.svg)](https://gitential.com/accounts/1294/projects/1473/share?uuid=923d642f-dd80-4b4e-9d58-cb42f7242231&utm_source=shield&utm_medium=shield&utm_campaign=1473)
[![Coding Hours](https://api.gitential.com/accounts/1294/projects/1473/badges/coding-hours.svg)](https://gitential.com/accounts/1294/projects/1473/share?uuid=923d642f-dd80-4b4e-9d58-cb42f7242231&utm_source=shield&utm_medium=shield&utm_campaign=1473)

**master status:**
[![Build Status](https://travis-ci.com/adrianjost/SmartLight-Firebase.svg?branch=master)](https://travis-ci.com/adrianjost/SmartLight-Firebase)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e0203f63985c42c191b6e4411bd8f4da)](https://www.codacy.com/app/adrianjost/SmartLight-Firebase?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=adrianjost/SmartLight-Firebase&amp;utm_campaign=Badge_Grade)

**V2 status:**
[![Build Status V2](https://travis-ci.com/adrianjost/SmartLight-Firebase.svg?branch=v2%2Fmain)](https://travis-ci.com/adrianjost/SmartLight-Firebase)

This Repository contains the (Web-) UI for SmartLight as well as the Firebase hosted Backend Code.

## Build Setup

``` bash
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
"# SmartLight-Firebase" 

## Database
### Schema
All Objects that are defined here will be explained in detail below. This is just an overview.
```js
{
  users: {UserObject, ...},
  lamps: {LampObject, ...},
  groups: {GroupObject, ...},
  gradients: {GradientObject, ...},
}
```

#### UserObject

```js
$userId: {
  apiSeret: String,
}
```

#### LampObject

```js
$lampId: {
  ownerId: userId,
  //allowedUsers: [userId, ...],

  name: String,
  icon: String,
  ip: String,
  hostname: String,
  state: { // only one child at a time allowed
    color: String, // #aabbcc
    gradient: gradientId
  }
}
```

#### GroupObject
Groups are, like the name hints us, groups of lamps. If you update the current State of a Group, a database-trigger will update all lamps from the group accordingly.

```js
$groupId: {
  ownerId: userId,
  //allowedUsers: [userId, ...],

  name: String,
  icon: String,
  lamps: [lampId, ...]
}
```

#### GradientObject
```js
$gradientId: {
  ownerId: userId,
  //allowedUsers: [userId, ...],

  colors: [String, ...], // [#aabbcc, ...]
  transitionTimes: [0, 3, 4, 10], // [#aabbcc, ...]
  loop: true
}
```