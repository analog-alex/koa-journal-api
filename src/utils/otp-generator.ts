/**
 * credits to https://github.com/Maheshkumar-Kakade
 * from: https://github.com/Maheshkumar-Kakade/otp-generator#readme
 */

/**
 * Generate password from allowed word
 */
const digits = '0123456789';
const alphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCase = alphabets.toUpperCase();
const specialChars = '#!&@';

function rand(min: number, max: number) {
  const random = Math.random();
  return Math.floor(random * (max - min) + min);
}

export default function (length: number) {
  const generateOptions = {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  };

  const allowsChars = ((generateOptions.digits || '') && digits) +
      ((generateOptions.alphabets || '') && alphabets) +
      ((generateOptions.upperCase || '') && upperCase) +
      ((generateOptions.specialChars || '') && specialChars);
  let password = '';
  while (password.length < length) {
    const charIndex = rand(0, allowsChars.length - 1);
    password += allowsChars[charIndex];
  }
  return password;
}
