import { formMachine } from './machine.js';
import { interpret } from 'xstate';
// flight handler

// start date handler

// return date handler

// submit handler

// const { initialState } = formMachine;

// const nextState = formMachine.transition(initialState, {
//   type: "RETURN_FLIGHT",
// });

// const nextState = formMachine.transition(initialState, {
//   type: 'CHANGE_START_DATE',
//   value: '02/14/2020',
// });

// console.log(nextState);

window.formService = interpret(formMachine);
window.formService.onTransition((state, event) => {
  console.log(state.value);
  console.log(event);

  // if one way flight event disable return date input
  // on change start date event, if event value is valid,
  // color green, if invalid color red for instance,
  // if there is a return and start is after return color red
  // on submitting if dates are not in order send INVALID event
  // and display details
  // if everything is in order fire off request and if
  // successful send SUCCESS event
});
