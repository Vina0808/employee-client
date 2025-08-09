import { toWords } from 'number-to-words';

export const convertNumberToWords = (number) => {
  try {
    const words = toWords(number);
    return words.charAt(0).toUpperCase() + words.slice(1) + ' đồng';
  } catch (e) {
    return '';
  }
};
