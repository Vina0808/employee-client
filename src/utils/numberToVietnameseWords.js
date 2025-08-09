// utils/numberToVietnameseWords.js

export const numberToVietnameseWords = (number) => {
  const ones = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  const readTriple = (num) => {
    let hundred = Math.floor(num / 100);
    let ten = Math.floor((num % 100) / 10);
    let unit = num % 10;
    let result = '';

    if (hundred > 0) {
      result += ones[hundred] + ' trăm';
      if (ten === 0 && unit > 0) result += ' linh';
    }

    if (ten > 1) {
      result += ' ' + ones[ten] + ' mươi';
      if (unit === 1) result += ' mốt';
      else if (unit === 5) result += ' lăm';
      else if (unit > 0) result += ' ' + ones[unit];
    } else if (ten === 1) {
      result += ' mười';
      if (unit === 1) result += ' một';
      else if (unit === 5) result += ' lăm';
      else if (unit > 0) result += ' ' + ones[unit];
    } else if (ten === 0 && unit > 0) {
      result += ' ' + ones[unit];
    }

    return result.trim();
  };

  const addCommas = (str) => {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const [intPart, decPart] = number.toFixed(1).split('.'); // lấy phần thập phân đúng 1 chữ số

  const num = parseInt(intPart, 10);
  if (isNaN(num)) return '';

  const units = ['', ' nghìn', ' triệu', ' tỷ'];
  let result = '';
  let i = 0;
  let temp = num;

  while (temp > 0) {
    const triple = temp % 1000;
    if (triple > 0) {
      const prefix = readTriple(triple);
      result = prefix + units[i] + (result ? ', ' + result : '');
    }
    temp = Math.floor(temp / 1000);
    i++;
  }

  result = result || 'không';

  if (decPart && decPart !== '0') {
    result += ' phẩy ' + ones[parseInt(decPart)];
  }

  return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng chẵn';
};
