export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createOPT = (
  length: number = 6,
  charCombination: string = "0123456789",
): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charCombination.length);
    result += charCombination[randomIndex];
  }
  return result;
};
