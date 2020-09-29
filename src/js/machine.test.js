import { formMachine } from './machine.js';
import { interpret } from 'xstate';

const formService = interpret(formMachine);
const initialState = formMachine.initialState;

test("The machine should start out in the 'dateInvalid' state of 'oneWayFlight'.", () => {
  expect(
    initialState.matches('editing.oneWayFlight.dateInvalid')
  ).toBe(true);
});

test("When selecting return flight with no dates, the machine should end up in the 'datesInvalid state of 'returnFlight'.", () => {
  expect(
    formMachine
      .transition(initialState, 'RETURN_FLIGHT')
      .matches('editing.returnFlight.datesInvalid')
  ).toBe(true);
});

test("When in the 'oneWayFlight.dateInvalid' state and a valid date is selected, transition to 'dateValid'.", () => {
  expect(
    formMachine
      .transition('editing.oneWayFlight.dateInvalid', {
        type: 'CHANGE_START_DATE',
        value: '2020-09-29',
      })
      .matches('editing.oneWayFlight.dateValid')
  ).toBe(true);
});

// oneway flight valid start
test("When in the 'oneWayFlight.dateValid' state and an invalid start is selected, the machine should go back to 'dateInvalid'.", () => {
  expect(
    formMachine
      .transition(initialState, {
        type: 'CHANGE_START_DATE',
        value: '',
      })
      .matches('editing.oneWayFlight.dateInvalid')
  ).toBe(true);
});

// return with valid start selected
// TODO: think i should use the service here
test("When selecting a valid start date with no return date while in the 'returnFlight' state the machine should transition to '.returnFlight.returnInvalid'.", () => {
  // expect(
  //   formMachine
  //     .transition('editing.returnFlight.datesValid', {
  //       type: 'CHANGE_START_DATE',
  //       value: '2020-09-29',
  //     })
  //     .matches('editing.returnFlight.datesValid')
  // ).toBe(true);

  formService.start();
  formService.send('RETURN_FLIGHT');
  formService.send({
    type: 'CHANGE_START_DATE',
    value: '2020-09-29',
  });
  expect(
    formService.state.matches('editing.returnFlight.returnInvalid')
  ).toBe(true);
});

// return with valid start and end
test("When selecting a valid end date after a valid start date while in the 'returnFlight' state the machine should transition to '.returnFlight.datesValid'.", () => {
  formService.send({
    type: 'CHANGE_END_DATE',
    value: '2020-09-30',
  });
  expect(
    formService.state.matches('editing.returnFlight.datesValid')
  ).toBe(true);
});

// return with invalid start selected
test("Going from valid start and end to invalid start date while in the 'returnFlight' state the machine should transition to '.returnFlight.startInvalid'.", () => {
  formService.send({
    type: 'CHANGE_START_DATE',
    value: '',
  });
  expect(
    formService.state.matches('editing.returnFlight.startInvalid')
  ).toBe(true);
});
// return with valid end and no start
// how would this happen?
// selected return flight and entered return date first

// return with no start and invalid end
