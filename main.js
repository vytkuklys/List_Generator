const submitBtn = document.querySelector(".submit");
const selectToggler = document.querySelector('.c-dropdown');
const selectOptions = document.querySelectorAll(".c-dropdown__option");
const checkboxToggler = document.querySelectorAll(".js-digits__check");
const maxValueInput = document.getElementById("max");

const handleClickGenerateList = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const digits = getCheckedDigits();
    const range = getRangeOfDigits();
    if (isFormFilledCorrectly(sequence, digits, range)) {
        var t0 = performance.now()
        handleList(sequence, digits, range);
        var t1 = performance.now()
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    }
}

const getCheckedDigits = () => {
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');
    const all = document.getElementById('All');
    const digits = [];

    if(all.checked)
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
    } else if (isRangeAcceptable(range)) {
        displayAlertInvalidRange();
        return false;
    } else if (isArrayEmpty(digits) && isRangeEmpty(range)) {
        displayAlertSelectFilters();
        return false;
    }
    return true;
}

const displayAlertUnselectedSequence = () =>{
    const select = document.querySelector(".c-dropdown__select-trigger");
    select.classList.add("h-alert");
}

const displayAlertInvalidRange = () => {
    const alert = document.querySelector(".c-form__input-wrapper");
    alert.classList.add("h-alert");
}

const displayAlertSelectFilters = () => {
    const alert = document.querySelector(".c-digits__wrapper");
    alert.classList.add("h-alert");
}

function handleList(sequence, digits, range) {
    const digitsArr = [];
    let result = [];

    if (isArrayEmpty(digits)) {
        digitsArr.push(...getRangeDigits(range));
    } else {
        digitsArr.push(...digits);
    }
    digitsArr.forEach(digit => {
        if (isArrayEmpty(digit)) {
            result.push(...window[`get${sequence}Items`](1, range));
        } else {
            result.push(...window[`get${sequence}Items`](digit, range));
        }
    })
    deleteCurrentList();
    window[`render${sequence}List`](result);
    renderListInfo(sequence);
}

const deleteCurrentList = () =>{
    const list = document.querySelector('.c-output');
    if(list)
    {
        list.innerHTML = "";
        list.remove();
    }
}

const renderListInfo = (sequence) =>{
    const title = document.querySelector('.c-list__name');
    title.textContent = `${sequence}`;
}

function getFibonacciItems(digit, range) {
    const arr = [getFirstFibonacciValue(digit)];
    const MAX = getMaxValue(digit, range[1]);
    const MIN = getMinValue(digit, range[0]);
    let fib = getSecondFibonnaciValue(digit);

    for (let i = 0; fib <= MAX; i++) {
        arr.push(fib);
        fib = arr[i] + arr[i + 1];
    }
    if(arr[0] === 1) arr.unshift(0);
    return arr.filter(item => item >= MIN && item <= MAX);
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

function renderFibonacciList(arr){
    const output = document.createElement('div');
    const main = document.querySelector('main');
    const SIZE = arr.length;
    output.classList.add('c-output');
    for (let i = 0; i < SIZE; i++) {
        const span = document.createElement('span');
        span.textContent = `${arr[i]}`;
        output.appendChild(span);
    }
    main.appendChild(output);
}

const toggleSelectMenu = () => {
    document.querySelector('.c-dropdown__select').classList.toggle('open');
}

const removeAlert = () => {
    const alert = document.querySelectorAll(".h-alert");
    alert.forEach(alert =>{
        alert.classList.remove('h-alert');
    });
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

const getMaxValue = (digits, max = 0) => {
    const limit = Math.pow(10, digits);
    return max === 0 ? limit - 1 : limit > max ? max : limit - 1;
}

const getMinValue = (digits, min = 0) => {
    const start = Math.pow(10, digits - 1);
    return min === 0 ? min : start < min ? min : start;
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
    for (let i = 0; catalan <= MAX; i++) {
        catalan = getFactorial(i*2)/(getFactorial(i+1)*getFactorial(i));
        arr.push(catalan);
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

const handleCheckboxToggle = (btn) =>{
    isChecked = btn.parentNode.classList[1];
    if(btn.id === "All" && isChecked){
        checkboxToggler.forEach(check =>{
            check.parentNode.classList.remove("h-pushed");
            check.checked = false;
        })
    }else if(btn.id === "All" && isChecked === undefined){
        checkboxToggler.forEach(check =>{
            check.parentNode.classList.add("h-pushed");
            check.checked = true;
        })
    }else{
        btn.parentNode.classList.toggle("h-pushed");
    }
}

const isArrayEmpty = (digits) => {
    return Array.isArray(digits) && digits.length === 0;
}

const isRangeAcceptable = range => {
    if (isRangeEmpty(range)) {
        return false;
    }
    return range[0] > range[1];
}

const isRangeEmpty = (range) => {
    return range.length == 0;
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleClickGenerateList();
})

for (const option of selectOptions) {
    option.addEventListener('click', (e) => selectItem(e));
}

checkboxToggler.forEach(btn =>{
    btn.addEventListener("click", (event)=>handleCheckboxToggle(event.target));
})

selectToggler.addEventListener('click', () => {
    toggleSelectMenu();
    removeAlert();
});

max.addEventListener('click', removeAlert);

window.addEventListener('click', e => handleWindowClick(e));
