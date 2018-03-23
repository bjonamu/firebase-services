# firebase-services
A wrapper for firebase some already implemented functionality for your app

## Installation

  ```bash
  yarn add firebase-services
  ```
  or
  ```bash
  npm install --save firebase-services
  ```

## Usage

Create a singleton file to instantiate firebase services and pass the firebase config

```js
import firebaseServices from 'firebase-services'

const firebaseConfig = {} // get this from firebase

const services = firebaseServices(firebaseConfig)

export default services
```