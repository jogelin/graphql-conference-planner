import { Subscription } from 'rxjs/Subscription';

export function chunk(array, chunkSize) {
  const R = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    R.push(array.slice(i, i + chunkSize));
  }
  return R;
}


export function unsubscribeAll(subscriptions: Subscription[]) {
  if (!subscriptions) {
    return;
  }
  for (const sub of subscriptions) {
    if (sub && sub.unsubscribe()) {
      sub.unsubscribe();
    }
  }
}


export const dateToInput = (dateString) => {
  const date = new Date(dateString);

  let day = date.getDate().toString();
  day = parseInt(day, 10) < 10 ? `0${day}` : day;

  let month = (date.getMonth() + 1).toString();
  month = parseInt(month, 10) < 10 ? `0${month}` : month;

  return `${day}/${month}/${date.getFullYear()}`;
};

export const timeToInput = (dateString) => {
  const date = new Date(dateString);

  let hours = date.getHours().toString();
  hours = parseInt(hours, 10) < 10 ? `0${hours}` : hours;

  let minutes = (date.getMinutes() + 1).toString();
  minutes = parseInt(minutes, 10) < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes}`;
};

export const dateInputToDate = (dateInput) => {
  return new Date(dateInput.slice(-4), dateInput.slice(3, 5), dateInput.slice(0, 2));
};

export const timeInputToDate = (timeInput) => {
  const dt = new Date();
  dt.setHours(timeInput.slice(0, 2), timeInput.slice(-2));
  return dt;
};
