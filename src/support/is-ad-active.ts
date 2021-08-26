import { isAfter, isBefore, isEqual } from "date-fns";

export default (from: Date, until: Date) => {
  const today = new Date();

  return (isAfter(today, from) || isEqual(today, from)) &&
    (isBefore(today, until) || isEqual(today, until));
}
