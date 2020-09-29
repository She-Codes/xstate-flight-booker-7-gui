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
});
