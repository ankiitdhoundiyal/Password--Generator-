const inputslider = document.querySelector("[data-length-slider]");
const lengthdisplay = document.querySelector("[data-legth-number]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector(".copyBtn");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generatebutton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+=\\|?/;:",/[]{}'; // ✅ FIX: escaped backslash

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");

// set passwordlength
function handleSlider() {
  inputslider.value = passwordLength;
  lengthdisplay.innerText = passwordLength;
  const min = inputslider.min;
  const max = inputslider.max;
  inputslider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; // ✅ FIX: added space before ${color}
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 10); // ✅ FIX: was (0, 9) → digit 9 was never generated
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  // ✅ FIX: removed the duplicate definition
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// rules of generate password (it can be modified by your choice )
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }

  // to make copy wala span visible
  copyMsg.classList.add("toolkitactive"); // ✅ FIX: was "active" — CSS class is .toolkitactive

  setTimeout(() => {
    copyMsg.classList.remove("toolkitactive"); // ✅ FIX: was "active"
  }, 2000);
}

// shuffling password
function shuffelPassword(array) {
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    // ✅ FIX: was Array.length (always 1) → loop never ran
    // random j find out
    const j = Math.floor(Math.random() * (i + 1));
    // swap number at i and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  // empty string
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allcheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // special coonditon
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allcheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

//  event listener on password
inputslider.addEventListener("input", (e) => {
  passwordLength = parseInt(e.target.value, 10); // ✅ FIX: parse string → number
  handleSlider();
});

// event listener on  copy button
copybtn.addEventListener("click", () => {
  // ✅ FIX: was copyBtn (uppercase B) — undefined variable
  if (passwordDisplay.value) copyContent();
});

generateButton.addEventListener("click", () => {
  // none of the checkbox are selected
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //  finding new password
  console.log("starting thr journey");

  // remove old password
  password = "";

  //  lets put the stuff mentioned by checkboxes

  // if(uppercaseCheck.checked)
  // {
  //   password += generateUpperCase();
  // }

  // if (lowercaseCheckcaseCheck.checked) {
  //   password += generateLowerCase();
  // }

  // if (numberCheck.checked) {
  //   password += generateRandomNumber();
  // }

  // if (symbolCheck.checked) {
  //   password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numberCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolCheck.checked) funcArr.push(generateSymbol);

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("compulsary addition done");

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex addition done");

    password += funcArr[randIndex]();
  }
  console.log("remaining addition done");

  // shuffel password
  password = shuffelPassword(Array.from(password));
  console.log("shuffling  addition done");

  // show in ui
  passwordDisplay.value = password;
  console.log("ui addition done");

  // calculate strength
  calcStrength();
});
