'use strict';

const submitBtn = document.querySelector(".submit");
const selectToggler = document.querySelector('.c-dropdown');
const selectOptions = document.querySelectorAll(".c-dropdown__option");
const checkboxDigits = document.querySelectorAll(".js-digits__check");
const researchNumberBtn = document.querySelector('.c-search__btn');
const researchHideBtn = document.querySelector('.c-result__exit');
const pageNextBtn = document.querySelector('.js-pagination__next');
const pagePreviousBtn = document.querySelector('.js-pagination__previous');
const pageNumberBtn = document.querySelectorAll('.js-pagination__page');

const test = {
    "Catalan": getCatalanItems,
    "Fibonacci": getFibonacciItems,
    "PerfectSquare": getPerfectSquareItems,
    "Palindrome": getPalindromeItems,
    "countPerfectSquare": countPerfectSquarePages,
    "countPalindrome": countPalindromePages,
    "countPrime": countPrimePages
}

const lazyLoad = target => {
    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                const QUOTA = Number(getStaticValues('data-quota')) + 1;
                const MIN = Number(entry.target.textContent);
                const data = getFormData();
                const range = getRange(data[2], MIN + 1);
                setStaticValue('data-quota', QUOTA);
                handleList(data[0], data[1], range);
                observer.disconnect();
            }
        })
    });
    io.observe(target);
}

const displayNextPage = () => {
    let current = document.querySelector('.h-active');
    const LAST = 0;
    if (current.classList.contains('h-last') && refreshPagination() === 0) return;
    current = current.textContent;
    const MIN = document.querySelector('.c-output').lastChild.textContent;
    const data = getFormData();
    const range = getRange(parseInt(MIN) + 1, data[2][1]);
    deleteCurrentList();
    handleList(data[0], data[1], range);
    current = parseInt(current) % 4;
    if (current == LAST) {
        changePaginationNumbers(4);
    }
    changeSelectedPageTo(current);
}

const refreshPagination = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const MIN = document.querySelector('.c-output').lastChild.textContent;
    const digits = getCheckedDigits();
    const range = getRange(parseInt(MIN) + 1, getRangeOfDigits()[1]);
    const PAGE = 248;
    const pages = Math.ceil(getPagesCount(sequence, digits, range) / PAGE);
    if (pages === 0) {
        return 0;
    }
    hidePagination();
    handlePagination(sequence, digits, range);
}

const displayPreviousPage = () => {
    let current = document.querySelector('.h-active').textContent;
    const START = '1';
    if (current === START) return;
    const MAX = document.querySelector('.c-output').firstChild.textContent;
    const data = getFormData();
    const range = getRange(data[2][0], parseInt(MAX) - 1);
    deleteCurrentList();
    handleReversedList(data[0], data[1], range);
    current = (parseInt(current) % 4);
    if (current >= 2) {
        changeSelectedPageTo(current - 2);
    } else if (current == 1) {
        changePaginationNumbers(-4);
        displayPagination(4);
        changeSelectedPageTo(3);
    } else if (current == 0) {
        changeSelectedPageTo(2);
    }
}

const changePaginationNumbers = (num) => {
    pageNumberBtn.forEach(number => {
        let current = parseInt(number.textContent);
        number.textContent = `${current + num}`;
    })
}

const refreshPaginationNumbers = () => {
    let i = 1;
    pageNumberBtn.forEach(number => number.textContent = `${i++}`);
}

const displayClickedPage = (e) => {
    let current = document.querySelector('.h-active').getAttribute('data-id');
    const clicked = e.path[0].getAttribute('data-id');
    if (!clicked) return;
    if (current < clicked) {
        while (current < clicked) {
            displayNextPage();
            current++;
        }
    } else if (current > clicked) {
        while (current > clicked) {
            displayPreviousPage();
            current--;
        }
    }
}

const getFormData = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const digits = getCheckedDigits();
    const range = getRangeOfDigits();
    return [sequence, digits, range];
}

const updateQuota = (num) => {
    const QUOTA = Number(getStaticValues('data-quota')) + num;
    setStaticValue('data-quota', QUOTA);
}

const changeSelectedPageTo = (current) => {
    const pages = document.querySelectorAll('.js-pagination__page');
    let i = 0;
    for (; !pages[i].classList.contains('h-active'); i++);
    pages[i].classList.remove('h-active');
    pages[current].classList.add('h-active');
}

const getRange = (min, max) => {
    let range = [];
    if (!max) range[1] = 9999999999;
    else range[1] = max;
    range[0] = parseInt(min);
    return range;
}

const handleClickGenerateList = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const digits = getCheckedDigits();
    const range = getRangeOfDigits();
    if (isFormFilledCorrectly(sequence, digits, range)) {
        deleteCurrentList();
        handleList(sequence, digits, range);
        hidePagination();
        refreshPaginationNumbers();
        handlePagination(sequence, digits, range);
    }
}

const handlePagination = (sequence, digits, range) => {
    const PAGE = 248;
    const page_count = Math.ceil(getPagesCount(sequence, digits, range) / PAGE);

    console.log(page_count);
    displayPagination(page_count);
}

const displayPagination = (count) => {
    const pages = document.querySelectorAll('.js-pagination__page');
    const pagination = document.querySelector('.c-pagination__wrapper');

    if (count < 1) return;
    let i = 0;
    for (; i < count && i < 4; i++) {
        pages[i].classList.remove('h-hide');
        pages[i].classList.remove('h-active');
        pages[i].classList.remove('h-last');
        if (i == 0) {
            pages[0].classList.add('h-active');
        }
    }

    pages[i - 1].classList.add('h-last');
    pagination.classList.remove('h-hide');
}

const hidePagination = () => {
    const pages = document.querySelectorAll('.js-pagination__page');
    const pagination = document.querySelector('.c-pagination__wrapper');

    for (let i = 0; i < 4; i++) {
        pages[i].classList.add('h-hide');
    }
    pagination.classList.add('h-hide');
}

const getPagesCount = (sequence, digits, range) => {
    const digitsArr = [];
    const FOURPAGES = 992;
    let counter = 0;

    if (isArrayEmpty(digits)) {
        digitsArr.push(...getRangeDigits(range));
    } else {
        digitsArr.push(...digits);
    }
    digitsArr.forEach(digits => {
        if (counter >= FOURPAGES) {
            return;
        }
        if (isArrayEmpty(digits)) {
            counter += test[`count${sequence}`](1, range);
        } else {
            counter += test[`count${sequence}`](digits, range);
        }
    });
    return counter;
}

const getCheckedDigits = () => {
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');
    const all = document.getElementById('All');
    const digits = [];

    if (all.checked)
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

const displayAlertUnselectedSequence = () => {
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
    digitsArr.forEach(digits => {
        if (isArrayEmpty(digits)) {
            result.push(...window[`get${sequence}Items`](1, range, result.length));
        } else {
            result.push(...window[`get${sequence}Items`](digits, range, result.length));
        }
    })
    renderList(result);
    renderListInfo(sequence);
}
/*reverse list is used for the purposes of pagination*/
function handleReversedList(sequence, digits, range) {
    const digitsArr = [];
    let arr = [];
    let result = [];
    let length;
    if (isArrayEmpty(digits)) {
        digitsArr.push(...getRangeDigits(range));
    } else {
        digitsArr.push(...digits);
    }
    length = digitsArr.length;
    while (length-- > 0) {
        if (isArrayEmpty(digits[length])) {
            result.push(...window[`get${sequence}ItemsReversed`](1, range, result.length));
        } else {
            result.push(...window[`get${sequence}ItemsReversed`](digits[length], range, result.length));
        }
    }
    arr = reverseArr(result);
    renderList(arr);
    renderListInfo(sequence);
}

function reverseArr(arr) {
    let array = arr;
    var left = null;
    var right = null;
    var length = array.length;
    for (left = 0, right = length - 1; left < right; left += 1, right -= 1) {
        var temporary = array[left];
        array[left] = array[right];
        array[right] = temporary;
    }
    return array;
}

const deleteCurrentList = () => {
    const lists = document.querySelectorAll('.c-output');
    lists.forEach(list => {
        if (list) {
            list.innerHTML = "";
            list.remove();
        }
    })
}

const renderListInfo = (sequence) => {
    const title = document.querySelector('.c-list__title');
    sequence = sequence === 'PerfectSquare' ? 'Perfect Square' : sequence;
    title.textContent = `List of ${sequence} Numbers`;
}

const renderList = (result) => {
    const output = document.createElement('div');
    const main = document.querySelector('main');
    const SIZE = result.length;
    output.classList.add('c-output');
    for (let i = 0; i < SIZE; i++) {
        const span = document.createElement('span');
        span.textContent = `${result[i]}`;
        output.appendChild(span);
    }
    if (SIZE >= 3000) {
        lazyLoad(output.lastChild);
    }
    main.appendChild(output);
}

function getFibonacciItems(digit, range = []) {
    const arr = [getFirstFibonacciValue(digit)];
    const MAX = getMaxValue(digit, range[1]);
    const MIN = getMinValue(digit, range[0]);
    let fib = getSecondFibonnaciValue(digit);

    for (let i = 0; fib <= MAX; i++) {
        arr.push(fib);
        fib = arr[i] + arr[i + 1];
    }
    if (arr[0] === 1) arr.unshift(0);
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

function getCatalanItems(digit, range = []) {
    const arr = [];
    const MAX = getMaxValue(digit, range[1]);
    const MIN = getMinValue(digit, range[0]);
    let catalan = 0;
    for (let i = 0; catalan <= MAX; i++) {
        catalan = getFactorial(i * 2) / (getFactorial(i + 1) * getFactorial(i));
        arr.push(Math.round(catalan));
    }
    return arr.filter(item => item >= MIN && item <= MAX);
}

const getFactorial = (digit) => {
    if (digit == 0 || digit == 1) {
        return 1;
    } else {
        return digit * getFactorial(digit - 1);
    }
}

function getPalindromeItems(digit, range = [], pushed = 0) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const result = [];
    const OPTIMIZE = getOptimalValues(digit);
    let counter = 0;
    counter = 0;
    for (let i = MIN; i <= MAX && pushed + counter < 248; i++) {
        if (parseFloat(
                i
                .toString()
                .split('')
                .reverse()
                .join('')
            ) === i) {
            result.push(i);
            counter++;
            if(i % OPTIMIZE[2] >= OPTIMIZE[3]){
                i -= OPTIMIZE[1];
            }
            i += OPTIMIZE[0];
        }
    }
    return result;
}

function countPalindromePages(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const digits = (MAX + "").length;
    const divisor = Math.pow(10, Math.floor(digits * 0.5));
    /*Simple formula based on observations of palindrome patterns below*/
    const pages = 
        Math.floor(MAX / divisor) - Math.floor(MIN / divisor)
        + isSecondNumberHalfBigger(MAX + "", digits - 1);
    return pages;
}

const isSecondNumberHalfBigger = (num, digits) =>{
    const half = Math.ceil(digits / 2)

    for (let i = 0; digits >= half; i++, digits--){
        if (parseInt(num[i]) > parseInt(num[digits])){
            return 0;
        }
    }
    return 1;
}

function getPalindromeItemsReversed(digit, range = [], length) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const result = [];
    const OPTIMIZE = getOptimalValuesReversed(digit);
    let counter = 0;
    counter = 0;
    for (let i = MAX; i >= (MIN == 1 ? 0 : MIN) && length + counter < 248; i--) {
        if (parseFloat(
                i
                .toString()
                .split('')
                .reverse()
                .join('')
            ) === i) {
            result.push(i);
            counter++;
            if(i % OPTIMIZE[2] < OPTIMIZE[3]){
                i += OPTIMIZE[1];
            }
            i -= OPTIMIZE[0];
        }
    }
    return result;
}


const getOptimalValues = (digit) => {
    switch (digit) {
        case 1:
        case 2:
        case 3:
            return [0, 0, 100, 90]
        case 4:
            return [99, 90, 100, 90];
        case 5:
            return [99, 90, 1000, 900];
        case 6:
        case 7:
            return [999, 990, 1000, 900];
        case 8:
        case 9:
            return [9999, 9990, 100000, 90000];
        case 10:
            return [99999, 99989, 100000, 90000];
        default:
            break;
    }
}

const getOptimalValuesReversed = (digit) => {
    switch (digit) {
        case 1:
        case 2:
        case 3:
            return [0, 0, 100, 10]
        case 4:
            return [99, 90, 100, 10];
        case 5:
            return [99, 90, 1000, 100];
        case 6:
        case 7:
            return [999, 990, 1000, 100];
        case 8:
        case 9:
            return [9999, 9990, 100000, 10000];
        case 10:
            return [99999, 99989, 100000, 10000];
        default:
            break;
    }
}

function getPerfectSquareItems(digit, range, pushed = 0) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const PAGE = 248;
    const arr = [];
    let counter = 0;
    for (let i = MIN; i <= MAX && counter + pushed < PAGE; i++) {
        if (i >= 0) {
            let root = Math.sqrt(i);
            if (Number.isInteger(root)) {
                arr.push(i)
                counter++;
            }
        }
    }
    return arr;
}

function countPerfectSquarePages(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    let counter = 0;
    for (let i = MIN; i <= MAX && counter < 992; i++) {
        if (i >= 0) {
            let root = Math.sqrt(i);
            if (Number.isInteger(root)) {
                counter++;
            }
        }
    }
    return counter;
}

function getPerfectSquareItemsReversed(digit, range, length) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const arr = [];
    let counter = 0;
    for (let i = MAX; i >= (MIN == 1 ? 0 : MIN) && length + counter < 248; i--) {
        if (i >= 0) {
            let root = Math.sqrt(i);
            if (Number.isInteger(root)) {
                arr.push(i)
                counter++;
            }
        }
    }
    return arr;
}

const setStaticValue = (data, printed) => {
    if (Number.isInteger(printed)) {
        document.querySelector(`[${data}]`).setAttribute(`${data}`, `${printed}`);
    }
}

function getPrimeItems(digit, range, length) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const limit = Math.sqrt(MAX);
    const result = [];
    const arr = new Array(MAX + 1);
    let counter = 0;
    for (let i = 2; i <= limit; i++) {
        if (!arr[i]) {
            for (var j = i * i; j <= MAX; j += i) {
                arr[j] = true;
            }
        }
    }
    console.log(MAX)
    for (let i = MIN; i <= MAX && length + counter < 248; i++) {
        if (!arr[i]) {
            result.push(i);
            counter++;
        }
    }
    return result;
}

function countPrimePages(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const limit = Math.sqrt(MAX);
    const result = [];
    const arr = new Array(MAX);
    let counter = 0;
    for (let i = 2; i <= limit; i++) {
        if (arr[i]) {
            for (var j = i * i; j < MAX; j += i) {
                arr[j] = true;
            }
        }
    }
    for (let i = MIN; i < MAX && counter < 992; i++) {
        if (!arr[i]) {
            counter++;
        }
    }
    return counter;
}

function getPrimeItemsReversed(digit, range, length) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const limit = Math.sqrt(MAX);
    const result = [];
    const arr = new Array(MAX + 1);
    let counter = 0;
    let i = 0;
    for (let i = 2; i <= limit; i++) {
        if (!arr[i]) {
            for (var j = i * i; j <= MAX; j += i) {
                arr[j] = true;
            }
        }
    }
    for (let i = MAX; i >= MIN && length + counter < 248; i--) {
        if (!arr[i]) {
            result.push(i);
            counter++;
        }
    }
    return result;
}

const getStaticValues = (data) => {
    const value = document.querySelector(`[${data}]`).getAttribute(`${data}`);
    if (Number(value)) {
        return value;
    }
    return 0;
}

const toggleSelectMenu = () => {
    document.querySelector('.c-dropdown__select').classList.toggle('open');
}

const removeAlert = () => {
    const alert = document.querySelectorAll(".h-alert");
    alert.forEach(alert => {
        alert.classList.remove('h-alert');
    });
}

const selectItem = e => {
    let item = e.target;
    if (!item.classList.contains('selected')) {
        if (item.parentNode.querySelector('.c-dropdown__option.selected')) {
            item.parentNode.querySelector('.c-dropdown__option.selected').classList.remove('selected');
        }
        item.classList.add('selected');
        item.closest('.c-dropdown__select').querySelector('.c-dropdown__select-trigger span').textContent = item
            .textContent;
    }
    handleCheckboxVisibility();
}

const handleCheckboxVisibility = () =>{
    const selected = document.querySelector('.selected').textContent;
    const num8 = document.getElementById('8');
    const num9 = document.getElementById('9');
    const num10 = document.getElementById('10');
    if (selected === 'Palindrome' || selected === 'Prime'){
        if (num9.parentNode.classList.contains('h-pushed')){
            handleCheckboxToggle(num9);
        }
        if (num10.parentNode.classList.contains('h-pushed')){
            handleCheckboxToggle(num10);
        }
        if (selected == 'Prime'){
            if (num8.parentNode.classList.contains('h-pushed')){
                handleCheckboxToggle(num8);
            }
            num8.parentNode.classList.add('h-hide');
        }
        num9.parentNode.classList.add('h-hide');
        num10.parentNode.classList.add('h-hide');
    }
    else{
        num9.parentNode.classList.remove('h-hide');
        num10.parentNode.classList.remove('h-hide');
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
    return min === 0 && digits == 1 ? min : start < min ? min : start;
}

const handleCheckboxToggle = (btn) => {
    const isChecked = btn.parentNode.classList[1];
    const all_btn = document.getElementById('All');

    if (btn.id !== "All" && all_btn.parentNode.classList[1]) {
        all_btn.parentNode.classList.remove("h-pushed");
        all_btn.checked = false;
    }
    if (btn.id === "All" && isChecked) {
        checkboxDigits.forEach(check => {
            check.parentNode.classList.remove("h-pushed");
            check.checked = false;
        })
    } else if (btn.id === "All" && isChecked === undefined) {
        checkboxDigits.forEach(check => {
            if(!check.parentNode.classList.contains('h-hide')){
                check.parentNode.classList.add("h-pushed");
                check.checked = true;
            }
        })
    } else {
        btn.parentNode.classList.toggle("h-pushed");
    }
    removeAlert();
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

const handleResearchNumber = () => {
    const number = Number(document.querySelector('.c-search__input').value);
    if (!Number.isInteger(number)) return;
    const numberData = {
        "fibonacci": isInSequence('Fibonacci', number),
        "palindrome": isInSequence('Palindrome', number),
        "catalan": isInSequence('Catalan', number),
        "perfect-square": isInSequence('PerfectSquare', number)
    }
    deleteResearchResults();
    renderBlur();
    displayResearchedNumber(number, numberData);
}

const displayResearchedNumber = (number, data) => {
    const table = document.querySelector('.c-result');
    const title = document.querySelector('.c-result__title');

    title.textContent = number;
    for (const key of Object.keys(data)) {
        const icon = document.createElement('i');
        const item = document.querySelector(`.js-${key}`);
        icon.classList.add('fas', `${data[key] ? 'fa-check-circle' : 'fa-times-circle'}`);
        item.appendChild(icon);
    }
    table.classList.remove('h-hide')
}

const hideResearchTable = () => {
    const table = document.querySelector('.c-result');

    table.classList.add('h-hide');
    deleteResearchResults();
    removeBlur();
}

const deleteResearchResults = () => {
    const items = document.querySelectorAll('.c-result__item');

    items.forEach(item => {
        if (item.lastChild.classList) {
            item.removeChild(item.lastChild);
        }
    });
}

const isInSequence = (sequence, number) => {
    const range = [number, number];
    const digit = getDigitCount(number);
    console.log(digit, range);
    return (window[`get${sequence}Items`](digit, range)[0] === number);
}

const renderBlur = () => {
    if (document.querySelector('.blur__JS')) return;

    const blur = document.createElement('div');
    blur.classList.add('blur__JS');
    document.body.appendChild(blur);
}

const removeBlur = () => {
    const blur = document.querySelector('.blur__JS');
    blur.parentNode.removeChild(blur);
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleClickGenerateList();
})

for (const option of selectOptions) {
    option.addEventListener('click', (e) => selectItem(e));
}

checkboxDigits.forEach(btn => {
    btn.addEventListener("click", (event) => handleCheckboxToggle(event.target));
})

selectToggler.addEventListener('click', () => {
    toggleSelectMenu();
    removeAlert();
});

researchNumberBtn.addEventListener('click', handleResearchNumber);

researchHideBtn.addEventListener('click', hideResearchTable);

pageNextBtn.addEventListener('click', displayNextPage);

pagePreviousBtn.addEventListener('click', displayPreviousPage);

pageNumberBtn.forEach((number) => {
    number.addEventListener('click', (e) => displayClickedPage(e));
});

max.addEventListener('click', removeAlert);

window.addEventListener('click', e => handleWindowClick(e));

function showChecked() {
    const digits = [];
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');

    checkboxItems.forEach(item => {
        item.checked ? digits.push(parseInt(item.id)) : ""
    })
}

console.log(getPerfectSquareItems(3, [121, 121]));