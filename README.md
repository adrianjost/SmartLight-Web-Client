# firebase-smart-light

> A Firebase Hosted SmartLight Client

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