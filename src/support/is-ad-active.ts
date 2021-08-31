import { isAfter, isBefore, isEqual } from "date-fns";

export default (from: Date, until: Date, dateToCompare = new Date()) => {
  return (isAfter(dateToCompare, from) || isEqual(dateToCompare, from)) &&
    (isBefore(dateToCompare, until) || isEqual(dateToCompare, until));
}
