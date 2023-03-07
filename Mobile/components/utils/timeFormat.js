export function timeFormat(
  value = 0,
  hoursFormat = true,
  minutesFormat = true,
  secondsFormat = true
) {
  let time = "00:00:00";
  const hours = parseInt(value / 3600);
  const minutes = parseInt((value / 60) % 60);
  const seconds = parseInt(value % 60);

  if (hoursFormat && minutesFormat && secondsFormat) {
    time =
      `0${hours}`.slice(-2) +
      ":" +
      `0${minutes}`.slice(-2) +
      ":" +
      `0${seconds}`.slice(-2);
  } else if (!hoursFormat && minutesFormat && secondsFormat) {
    time = `0${minutes}`.slice(-2) + ":" + `0${seconds}`.slice(-2);
  } else if (hoursFormat && minutesFormat && !secondsFormat) {
    time = `0${hours}`.slice(-2) + ":" + `0${minutes}`.slice(-2);
  }

  return time;
}
