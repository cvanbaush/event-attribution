import moment from "moment";

export default function(source, dest) {
  return moment(source).isSame(dest, "day");
}
