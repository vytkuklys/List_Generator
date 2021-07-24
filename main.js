const submitBtn = document.querySelector(".submit");
const selectToggler = document.querySelector('.c-dropdown');
const selectOptions = document.querySelectorAll(".c-dropdown__option");
const checkDigits = document.querySelectorAll(".js-digits__check");

const toggleSelectMenu = () => {
    document.querySelector('.c-dropdown__select').classList.toggle('open');
}

const selectItem = e => {
    item = e.target;
    if (!item.classList.contains('selected')) {
        if (item.parentNode.querySelector('.c-dropdown__option.selected')) {
            item.parentNode.querySelector('.c-dropdown__option.selected').classList.remove('selected');
        }
        item.classList.add('selected');
        item.closest('.c-dropdown__select').querySelector('.c-dropdown__select-trigger span').textContent = item
            .textContent;
    }
}

const handleWindowClick = e => {
    const select = document.querySelector('.c-dropdown__select')
    if (!select.contains(e.target)) {
        select.classList.remove('open');
    }
}

const handleClickGenerateList = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const digits = getCheckedDigits();
    const range = getRangeOfDigits();
    if (isFormFilledCorrectly(sequence, digits, range)) {
        console.log(isFormFilledCorrectly(sequence, digits, range))
        var t0 = performance.now()
        handleList(sequence, digits, range);
        var t1 = performance.now()
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    }
}
const getCheckedDigits = () => {
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');
    const digits = [];
    checkboxItems.forEach(item => {
        item.checked ? digits.push(parseInt(item.id)) : ""
    })
    return digits;
}

const getRangeOfDigits = () => {
    const items = document.querySelectorAll('.digit-range');
    const range = [];
    items.forEach(item => {
        item.value ? range.push(parseInt(item.value)) : "";
    })
    return range;
}

const isFormFilledCorrectly = (sequence, digits, range) => {
    if (sequence === "SelectaSequence") {
        displayAlertUnselectedSequence();
        return false;
    } else if (isRangeNotAcceptable(range)) {
        displayAlertInvalidRange();
        return false;
    } else if (isArrayEmpty(digits) && isRangeEmpty(range)) {
        displayAlert
        return false;
    }
    return true;
}

const displayAlertUnselectedSequence = () =>{
    const select = document.querySelector(".c-dropdown__select-trigger");
    select.classList.add("h-alert");
    console.log(selectToggler);
}

const isArrayEmpty = (digits) => {
    return Array.isArray(digits) && digits.length === 0;
}

const isRangeNotAcceptable = range => {
    if (isRangeEmpty(range)) {
        return false;
    }
    return range[0] > range[1];
}

const isRangeEmpty = (range) => {
    return range.length === 2 && (!range[0] && range[0] !== 0) && (!range[1] && range[1] !== 0);
}

function handleList(sequence, digits, range) {
    const digitsArr = [];
    if (isArrayEmpty(digits)) {
        digitsArr.push(...getRangeDigits(range));
    } else {
        digitsArr.push(...digits);
    }
    digitsArr.forEach(digit => {
        if (isArrayEmpty(digit)) {
            console.log(`get${sequence}Items`)
            const arr = window[`get${sequence}Items`](1, range);
            console.log(arr)
        } else {
            console.log(`get${sequence}Items`)
            const arr = window[`get${sequence}Items`](digit, range);
            console.log(arr)
        }
    })
}

const getRangeDigits = (range) => {
    const digits = [];
    let minDigits = getDigitCount(range[0]);
    let maxDigits = getDigitCount(range[1]);
    while (minDigits <= maxDigits) {
        digits.push(minDigits++);
    }
    return digits;
}

const getDigitCount = (digit) => {
    let count = 0;
    while (digit > 0) {
        count++;
        digit = Math.floor(digit / 10);
    }
    return count;
}

function getFibonacciItems(digit, range) {
    const arr = [getFirstFibonacciValue(digit)];
    const MAX = getMaxValue(digit, range[1]);
    const MIN = getMinValue(digit, range[0]);
    console.log(MAX, "-max", MIN, "-min")
    let fib = getSecondFibonnaciValue(digit);
    for (let i = 0; fib <= MAX; i++) {
        arr.push(fib);
        fib = arr[i] + arr[i + 1];
    }
    return arr.filter(item => item >= MIN && item <= MAX);
}

const getMaxValue = (digits, max = 0) => {
    const limit = Math.pow(10, digits);
    return max === 0 ? limit - 1 : limit > max ? max : limit - 1;
}

const getMinValue = (digits, min = 0) => {
    const start = Math.pow(10, digits - 1);
    return min === 0 ? min : start < min ? min : start;
}

const getFirstFibonacciValue = (digits) => {
    const values = {
        1: 1,
        2: 13,
        3: 144,
        4: 1597,
        5: 10946,
        6: 121393,
        7: 1346269,
        8: 14930352,
        9: 102334155,
        10: 1134903170
    };
    return values[digits];
}

const getSecondFibonnaciValue = (digits) => {
    const values = {
        1: 1,
        2: 21,
        3: 233,
        4: 2584,
        5: 17711,
        6: 196418,
        7: 2178309,
        8: 24157817,
        9: 165580141,
        10: 1836311903
    };
    return values[digits];
}

const renderFib = (arr) => {
    const output = document.querySelector('.sequence-output');
    const size = arr.length;
    for (let i = 0; i < size; i++) {
        output.textContent += `${arr[i]} `;
    }
}

function getPerfectSquareItems(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const arr = [];
    for (let i = MIN; i <= MAX; i++) {
        if (i >= 0) {
            let root = Math.sqrt(i);
            if (Number.isInteger(root)) {
                arr.push(i)
            }
        }
    }
    return arr;
}

function getPrimeItems(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);

    const arr = [],
        limit = Math.sqrt(MAX),
        result = [];
    for (let i = MIN; i < MAX; i++) {
        arr.push(true);
    }
    for (let i = 2; i <= limit; i++) {
        if (arr[i]) {
            for (var j = i * i; j < MAX; j += i) {
                arr[j] = false;
            }
        }
    }
    for (let i = 2; i < MAX; i++) {
        if (arr[i]) {
            result.push(i);
        }
    }

    return result;
};

function getPalindromeItems(digit, range) {
    let min = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const result = [];
    if (min < 11) {
        min = 11;
    }
    for (let i = min; i <= MAX; i++) {

        if (parseFloat(
                i
                .toString()
                .split('')
                .reverse()
                .join('')
            ) === i) {
            result.push(i);
        }
    }
    return result;
}

function getCatalanItems(digit, range) {
    const arr = [];
    const MAX = getMaxValue(digit, range[1]);
    const MIN = getMinValue(digit, range[0]);
    let catalan = 0;
    console.log(MAX, "-max", MIN, "-min")
    for (let i = 0; catalan <= MAX; i++) {
        catalan = getFactorial(i*2)/(getFactorial(i+1)*getFactorial(i));
        arr.push(catalan);
        console.log(catalan+"\n")
    }
    return arr.filter(item => item >= MIN && item <= MAX);
}

function getFactorial(digit) {
    if (digit == 0 || digit == 1) {
        return 1;
    } else {
        return digit * getFactorial(digit - 1);
    }
}

const handleCheckDigits = (btn) =>{
    isChecked = btn.parentNode.classList[1];
    console.log(btn.id === "All" && isChecked !== undefined)
    if(btn.id === "All" && isChecked){
        checkDigits.forEach(check =>{
            check.parentNode.classList.remove("pushed");
        })
        console.log("1")
    }else if(btn.id === "All" && isChecked === undefined){
        console.log("2")
        checkDigits.forEach(check =>{
            check.parentNode.classList.add("pushed");
        })
    }else{
        console.log("3")
        btn.parentNode.classList.toggle("pushed");
    }
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleClickGenerateList();
})


for (const option of selectOptions) {
    option.addEventListener('click', (e) => selectItem(e));
}

checkDigits.forEach(btn =>{
    btn.addEventListener("click", (event)=>handleCheckDigits(event.target));
})

selectToggler.addEventListener('click', () => toggleSelectMenu());

window.addEventListener('click', e => handleWindowClick(e));