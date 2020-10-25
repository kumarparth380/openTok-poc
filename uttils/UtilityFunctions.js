const checkEmail = inputEmail => {
  if (inputEmail === '') {
    return true;
  }

  let email = inputEmail.toLowerCase();
  email = email.replace(/(^\s*)|(\s*$)/g, '');
  const checkMailboxMethod = new RegExp(
    '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$',
  );
  //   const checkMailboxMethod = new RegExp(
  //     "^[a-zA-Z0-9.!#$%&’'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
  //   );
  return checkMailboxMethod.test(email) && email.length < 50;
};

const displayPhoneNumber = number => {
  if (!number || number.length === 0) {
    return '';
  }
  let diplayNumber = '';
  if (number.length === 10) {
    diplayNumber = `(${number}`;
    if (diplayNumber.length >= 4) {
      diplayNumber = `${diplayNumber.substring(0, 4)}) ${diplayNumber.substring(
        4,
      )}`;
    }
    if (diplayNumber.length >= 9) {
      diplayNumber = `${diplayNumber.substring(0, 9)} ${diplayNumber.substring(
        9,
      )}`;
    }
  } else if (number.indexOf('-')) {
    diplayNumber = number.replace('-', ' ');
  }
  return diplayNumber;
};

const changePhoneFormat = inputPhone => {
  let number = inputPhone.replace(/\s+/g, '');
  number = number.replace(/[\\(\\)-]/g, '');
  return number;
};

const checkPhone = inputPhone => {
  let number = changePhoneFormat(inputPhone);
  number = number.replace(/(^\s*)|(\s*$)/g, '');
  const checkMethod = new RegExp('^[0-9]\\d*$');
  return (
    checkMethod.test(number) && number.length === 10 && inputPhone.length === 14
  );
};

export {checkEmail, displayPhoneNumber, checkPhone};
