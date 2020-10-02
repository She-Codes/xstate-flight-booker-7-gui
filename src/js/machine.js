import { Machine, assign } from 'xstate';

// Visualizer URL: https://xstate.js.org/viz/?gist=59f3b2cf358e371094d7ac448f273280
const formMachine = Machine({
  id: 'form',
  initial: 'editing',
  context: {
    startDate: undefined,
    returnDate: undefined,
  },
  states: {
    editing: {
      initial: 'oneWayFlight',
      states: {
        oneWayFlight: {},
        returnFlight: {
          on: {
            CHANGE_END_DATE: {
              actions: assign({
                returnDate: (c, event) => event.value,
              }),
            },
          },
        },
      },
      on: {
        CHANGE_START_DATE: {
          actions: assign({
            startDate: (c, event) => event.value,
          }),
        },
        ONE_WAY_FLIGHT: '.oneWayFlight',
        RETURN_FLIGHT: '.returnFlight',
        SUBMIT: 'submitting',
      },
    },
    submitting: {
      initial: 'validating',
      states: {
        validating: {
          on: {
            INVALID: '#form.editing',
            VALID: 'loading',
          },
        },
        loading: {
          on: {
            SUCCESS: '#form.submitted',
            ERROR: '#form.editing',
          },
        },
      },
    },
    submitted: {
      type: 'final',
    },
  },
});

export { formMachine };
