const integer = "Number must be an integer";
const positive = "Number must be positive";
const highest = "Number cannot be higher than {{number}}";
const min = "There must be at least 5 numbers";
const max = "There can be maximum of {{number}} numbers";
const useCustomDataForm = {
  integer,
  positive,
  highest,
  min,
  max
};
export {
  useCustomDataForm as default,
  highest,
  integer,
  max,
  min,
  positive
};
