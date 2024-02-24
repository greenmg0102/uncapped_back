import moment from 'moment';

const safeParseInt = (value) => {
  const stringValue = String(value).trim();

  const parsedInt = parseInt(stringValue, 10);

  if (Number.isNaN(parsedInt)) {
    return NaN;
  }

  return parsedInt;
};

const safeParseFloat = (value) => {
  const stringValue = String(value).trim();

  // Use parseFloat to convert the string to a floating-point number
  const parsedFloat = parseFloat(stringValue);

  // Check if the parsed value is a valid number
  if (Number.isNaN(parsedFloat)) {
    return NaN;
  }

  return parsedFloat;
};

const safeTrim = (value) => {
  // Ensure the input is a string
  const stringValue = String(value);

  // Use trim() to remove leading and trailing whitespace
  return stringValue.trim();
};

const safeLower = (value) => {
  // Ensure the input is a string
  const stringValue = String(value);

  // Use toLowerCase() to convert the string to lowercase
  return stringValue.toLowerCase();
};

const safeUpper = (value) => {
  // Ensure the input is a string
  const stringValue = String(value);

  // Use toUpperCase() to convert the string to uppercase
  return stringValue.toUpperCase();
};

const safeFirstUpper = (value) => {
  // Ensure the input is a string
  const stringValue = String(value);

  // Capitalize the first letter and combine with the rest of the string
  return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
};

const formatDate = (date: string) => {
  // Parse the input date string using Moment.js
  const parsedDate = moment(date, 'YYYY-MM-DD');

  // Format the parsed date in the desired format "YYYY/MM/DD"
  return parsedDate.format('YYYY/MM/DD');
};

const formatTime = (time: string) => {
  // Parse the input time string using Moment.js
  const parsedTime = moment(time, 'HH:mm:ss');

  // Format the parsed time in the desired format "HH:mm:ss"
  return parsedTime.format('HH:mm:ss');
};

const parseStringInt = (data: string): number => {
  return parseInt(data.replace(/,/g, ''), 10);
};

const parseStringFloat = (data: string): number => {
  return parseFloat(data.replace(/,/g, ''));
};

module.exports = {
  safeParseInt,
  safeParseFloat,
  safeTrim,
  safeLower,
  safeUpper,
  safeFirstUpper,
  formatDate,
  formatTime,
  parseStringInt,
  parseStringFloat,
};
