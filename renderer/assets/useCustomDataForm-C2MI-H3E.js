const integer = "Liczba musi być liczbą całkowitą";
const positive = "Liczba musi być dodatnia";
const highest = "Liczba nie może być większa niż {{number}}";
const min = "Musi być co najmniej 5 liczb";
const max = "Maksymalnie może być {{number}} liczb";
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
