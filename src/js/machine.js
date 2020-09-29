import { Machine, assign } from 'xstate';

// this is a placeholder, something more thorough whould be used
const isDateValid = (date) => !!Date.parse(date);

const startDateBeforeReturnDate = (startDate, returnDate) => {
  return startDate < returnDate;
};

const doesDateValidCondPass = (c, event) => isDateValid(event.value);

const doCurrentDatesPass = (context, e) => {
  const { startDate, returnDate } = context;

  const noStartDate = !startDate;
  const noReturnDate = !returnDate;
  const startDateValid = isDateValid(startDate);
  const returnDateValid = isDateValid(returnDate);
  const datesInOrder = startDateBeforeReturnDate(
    startDate,
    returnDate
  );

  if (noStartDate && noReturnDate) {
    return true;
  } else if (noStartDate && returnDateValid) {
    return true;
  } else if (startDateValid && noReturnDate) {
    return true;
  } else if (datesInOrder) {
    return true;
  } else {
    return false;
  }
};

// used when switching to return flight
const isCurrentStartInvalid = (context) => {
  const { startDate, returnDate } = context;

  return (
    !isDateValid(startDate) ||
    !startDateBeforeReturnDate(startDate, returnDate)
  );
};

// if return date is a valid date
// and return date is AFTER start date
// meaning there has to be a start date
const isReturnDateValid = (context, event) => {
  const { startDate } = context;
  const returnDate = event.value;
  const dateValid = isDateValid(returnDate);
  const datesInOrder = startDateBeforeReturnDate(
    startDate,
    returnDate
  );

  return dateValid && datesInOrder;
};

const isStartDateValidForReturnFlight = (context, event) => {
  const { returnDate } = context;
  const startDate = event.value;
  const dateValid = isDateValid(startDate);
  const noReturnDate = !returnDate;
  const datesInOrder = startDateBeforeReturnDate(
    startDate,
    returnDate
  );

  // if start date is a valid date
  // if it's the only date or
  // if there are two dates and start date is first
  if (dateValid && noReturnDate) return true;
  return dateValid && datesInOrder;
};

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
        oneWayFlight: {
          initial: 'checkingDateForOneWayFlight',
          states: {
            checkingDateForOneWayFlight: {
              always: [
                {
                  target: 'dateValid',
                  cond: doesDateValidCondPass,
                },
                {
                  target: 'dateInvalid',
                },
              ],
            },
            dateValid: {
              on: {
                SUBMIT: '#form.submitting',
              },
            },
            dateInvalid: {},
          },
          on: {
            CHANGE_START_DATE: [
              {
                target: '.dateValid',
                cond: doesDateValidCondPass,
                actions: assign({
                  startDate: (c, event) => event.value,
                }),
              },
              {
                target: '.dateInvalid',
                actions: assign({
                  startDate: undefined,
                }),
              },
            ],
          },
        },
        returnFlight: {
          initial: 'checkingDatesForReturnFlight',
          states: {
            checkingDatesForReturnFlight: {
              always: [
                {
                  target: 'datesValid',
                  cond: doCurrentDatesPass,
                },
                {
                  target: 'startInvalid',
                  cond: isCurrentStartInvalid,
                },
                {
                  target: 'returnInvalid',
                },
              ],
            },
            datesValid: {
              on: {
                SUBMIT: '#form.submitting',
              },
            },
            startInvalid: {},
            returnInvalid: {},
          },
          on: {
            CHANGE_START_DATE: [
              {
                target: '.datesValid',
                cond: isStartDateValidForReturnFlight,
                actions: assign({
                  startDate: (c, event) => event.value,
                }),
              },
              {
                target: '.startInvalid',
                actions: assign({
                  startDate: undefined,
                }),
              },
            ],
            CHANGE_END_DATE: [
              {
                target: '.datesValid',
                cond: isReturnDateValid,
                actions: assign({
                  returnDate: (c, event) => event.value,
                }),
              },
              {
                target: '.returnInvalid',
                cond: !doesDateValidCondPass,
                actions: assign({
                  returnDate: (c, event) => undefined,
                }),
              },
              {
                target: '.startInvalid',
                cond: (context, event) => {
                  return !startDateBeforeReturnDate(
                    context.startDate,
                    event.value
                  );
                },
                actions: assign({
                  returnDate: (c, event) => undefined,
                }),
              },
            ],
          },
        },
      },
      on: {
        ONE_WAY_FLIGHT: '.oneWayFlight',
        RETURN_FLIGHT: '.returnFlight',
      },
    },
    submitting: {
      on: {
        SUCCESS: 'submitted',
        ERROR: 'editing',
      },
    },
    submitted: {
      type: 'final',
    },
  },
});

export { formMachine };
