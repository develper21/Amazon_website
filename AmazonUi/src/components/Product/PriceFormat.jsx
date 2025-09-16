// Utility to format price using numeral.js
import numeral from "numeral";

export default function PriceFormat({ value }) {
  return numeral(value).format("$0,0.00");
}
