import mongoose from "mongoose";

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

export const normalizeText = (value: string | null | undefined) => {
  const normalized = value?.trim();
  if (normalized === undefined || normalized === null || normalized === "") {
    return undefined;
  }
  return normalized;
};

export const normalizeObjectId = (
  value: string | mongoose.Types.ObjectId | undefined,
) => {
  const raw =
    value instanceof mongoose.Types.ObjectId ? value.toString() : value;
  if (!raw || !mongoose.isValidObjectId(raw)) {
    return undefined;
  }
  return new mongoose.Types.ObjectId(raw);
};
