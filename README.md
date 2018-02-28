# redux-model

## Why creating this package

Using redux involves writing too many lines of boilerplate code, and it annoys me. So I decided to make things easy, and in the mean time respecting all the core concepts of redux.

## How to use

Let's start by this simple example.

You can also view this example running at <https://codesandbox.io/s/my241lzk4j>

```jsx
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createStore, compose, applyMiddleware } from "redux";
import {
  createModel,
  extractReducer,
  feedStore,
  extractSaga
} from "@gxl/redux-model";

const service = {
  updateCount(num) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(num);
      }, 1000);
    });
  }
};

const model = createModel({
  namespace: "home",
  state: {
    count: 0
  },
  watch: {
    count(val) {
      console.log("val changed", val);
    }
  },
  // every computation corresponds to a pair of action creator and reducer
  // and you can call model[computation_name] to trigger the action
  // no need to manually bind action creators to dispatch
  computations: {
    updateCount(state, count) {
      return {
        ...state,
        count
      };
    }
  },
  // every effect corresponds to an action creator, when called via model[effect_name],
  // an action will be dispatched, and the effect will be triggered
  // and effects is handled by redux saga
  effects: {
    *updateCountAsync(count) {
      const num = yield service.updateCount(count);
      this.updateCount(num);
    }
  }
});

const models = [model];
const reducer = extractReducer(models);
const sagaMiddleware = createSagaMiddleware();
const enhancers = [applyMiddleware(...[sagaMiddleware])];
const saga = extractSaga(models);
const store = createStore(reducer, {}, compose(...enhancers));

sagaMiddleware.run(saga);
// we have to put this after saga is running, or watch will not work
feedStore(store, models);

const Counter = props => {
  return (
    <div>
      <button onClick={() => model.updateCount(props.count - 1)}>Minus</button>
      {props.count}
      <button onClick={() => model.updateCount(props.count + 1)}>Add</button>
      <button onClick={() => model.updateCountAsync(props.count + 1)}>
        Add(async)
      </button>
    </div>
  );
};

// similar to react-redux's connect, we mapped state[namespace] to props by default
// you can change this behavior by passing the 2nd arg to connect, which is `mapStateToProps`
const ConnectedCounter = model.connect(Counter);

render(
  <Provider store={store}>
    <ConnectedCounter />
  </Provider>,
  document.getElementById("root")
);
```
