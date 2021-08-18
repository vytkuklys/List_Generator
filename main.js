const submitBtn = document.querySelector(".submit");
const selectToggler = document.querySelector('.c-dropdown');
const selectOptions = document.querySelectorAll(".c-dropdown__option");
const checkboxDigits = document.querySelectorAll(".js-digits__check");
const researchNumberBtn = document.querySelector('.c-search__btn');
const researchHideBtn = document.querySelector('.c-result__exit');

const lazyLoad = target => {
    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                const QUOTA = Number(getStaticValues('data-quota')) +1;
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

const getRange = (data, min) =>{
    let range = [];
    if (!data.length) range[1] = 9999999999;
    else range[1] = data[1];
    range[0] = min;
    return range;
}

const handleClickGenerateList = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const digits = getCheckedDigits();
    const range = getRangeOfDigits();
    const infoMsg = document.querySelector('.c-list__info');
    if (isFormFilledCorrectly(sequence, digits, range)) {
        setStaticValue('data-printed', 0);
        setStaticValue('data-quota', 1);
        deleteCurrentList();
        handleList(sequence, digits, range);
        infoMsg.classList.add('h-hide');
    }
}

const getFormData = () => {
    const sequence = document.querySelector('.c-dropdown__select-trigger').textContent.trim().replace(/ /g, "");
    const digits = getCheckedDigits();
    const range = getRangeOfDigits();
    return [sequence, digits, range];
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
    digitsArr.forEach(digits => {
        if (isArrayEmpty(digits)) {
            result.push(...window[`get${sequence}Items`](1, range));
        } else {
            result.push(...window[`get${sequence}Items`](digits, range));
        }
    })
    renderList(result);
    renderListInfo(sequence);
    console.log(result);
}

const deleteCurrentList = () =>{
    const lists = document.querySelectorAll('.c-output');
    lists.forEach(list =>{
        if(list)
        {
            list.innerHTML = "";
            list.remove();
        }
    })
} 

const renderListInfo = (sequence) =>{
    const title = document.querySelector('.c-list__title');
    sequence = sequence === 'PerfectSquare' ? 'Perfect Square' : sequence;
    title.textContent = `List of ${sequence} Numbers`;
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

const renderList = (result) =>{
    const output = document.createElement('div');
    const main = document.querySelector('main');
    const SIZE = result.length;
    output.classList.add('c-output');
    for (let i = 0; i < SIZE; i++) {
        const span = document.createElement('span');
        span.textContent = `${result[i]}`;
        output.appendChild(span);
    }
    if (SIZE >= 3000){
        lazyLoad(output.lastChild);
    }
    main.appendChild(output);
}

function getCatalanItems(digit, range = []) {
    const arr = [];
    const MAX = getMaxValue(digit, range[1]);
    const MIN = getMinValue(digit, range[0]);
    let catalan = 0;
    for (let i = 0; catalan <= MAX; i++) {
        catalan = getFactorial(i*2)/(getFactorial(i+1)*getFactorial(i));
        arr.push(Math.round(catalan));
    }
    return arr.filter(item => item >= MIN && item <= MAX);
}

const getFactorial = (digit)=> {
    if (digit == 0 || digit == 1) {
        return 1;
    } else {
        return digit * getFactorial(digit - 1);
    }
}

function getPalindromeItems(digit, range = []) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const result = [];
    const PRINTED = getStaticValues('data-printed');
    const QUOTA = getStaticValues('data-quota');
    const OPTIMIZE = getOptimalValues(digit);
    let counter = PRINTED ? PRINTED : 0;
    for (let i = MIN; i <= MAX && counter < 3000 * QUOTA; i++) {
        if (parseFloat(
                i
                .toString()
                .split('')
                .reverse()
                .join('')
            ) === i) {
                result.push(i);
                counter++;
                if(counter % OPTIMIZE[2] === 0){
                    i -= OPTIMIZE[1];
                }
                i+= OPTIMIZE[0];
        }
    }
    setStaticValue('data-printed', counter);
    return result;
}

const getOptimalValues = (digit) =>{
    switch(digit){
        case 1:
        case 2:
        case 3:
            return [0, 0, 1001]
        case 4:
            return [99, 90, 10];
        case 5:
            return [99, 90, 100];
        case 6:
            return [999, 990, 10];
        case 7:
            return [999, 990, 100];
        case 8: 
            return [9999, 9990, 10];
        case 9: 
            return [9999, 9990, 100];
        case 10:
            return [99999, 99989, 10];
        default:
            break;
    }
}

function getPerfectSquareItems(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const arr = [];
    const PRINTED = getStaticValues('data-printed');
    const QUOTA = getStaticValues('data-quota');
    let counter = PRINTED ? PRINTED : 0;
    for (let i = MIN; i <= MAX && counter < 3000 * QUOTA; i++) {
        if (i >= 0) {
            let root = Math.sqrt(i);
            if (Number.isInteger(root)) {
                arr.push(i)
                counter++;
            }
        }
    }
    setStaticValue('data-printed', counter);
    return arr;
}

const setStaticValue = (data, printed) =>{
    if (Number.isInteger(printed)) {
        document.querySelector(`[${data}]`).setAttribute(`${data}`, `${printed}`);
    }
}

function getPrimeItems(digit, range) {
    const MIN = getMinValue(digit, range[0]);
    const MAX = getMaxValue(digit, range[1]);
    const arr = [];
    const limit = Math.sqrt(MAX);
    const result = [];
    let counter = 0;
    let i = 0;
    for (let i = 0; i < MAX; i++) {
        arr.push(true);
    }
    for (let i = 2; i <= limit; i++) {
        if (arr[i]) {
            for (var j = i * i; j < MAX; j += i) {
                arr[j] = false;
            }
        }
    }
    for (let i = MIN; i < MAX && counter < 5000; i++) {
        // if (arr[i] && i > MIN && i < MAX) {
        if(arr[i]){
            result.push(i);
            counter++;
        }
    }
    return result;
};

const getStaticValues = (data) =>{
    const value = document.querySelector(`[${data}]`).getAttribute(`${data}`);
    if(Number(value)){
        return value;
    }
    return 0;
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
    return min === 0 && digits == 1 ? min : start < min ? min : start;
}

const handleCheckboxToggle = (btn) =>{
    const isChecked = btn.parentNode.classList[1];
    const all_btn = document.getElementById('All');

    if(btn.id !== "All" && all_btn.parentNode.classList[1]){
        all_btn.parentNode.classList.remove("h-pushed");
        all_btn.checked = false;
    }
    if(btn.id === "All" && isChecked){
        checkboxDigits.forEach(check =>{
            check.parentNode.classList.remove("h-pushed");
            check.checked = false;
        })
    }else if(btn.id === "All" && isChecked === undefined){
        checkboxDigits.forEach(check =>{
            check.parentNode.classList.add("h-pushed");
            check.checked = true;
        })
    }else{
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

const handleResearchNumber = () =>{
    const number = Number(document.querySelector('.c-search__input').value);
    if (!Number.isInteger(number)) return;
    const numberData = {
        "fibonacci" : isInSequence('Fibonacci', number),
        "palindrome" : isInSequence('Palindrome', number),
        "catalan" : isInSequence('Catalan', number),
        "perfect-square" : isInSequence('PerfectSquare', number)
    }
    deleteResearchResults();
    renderBlur();
    displayResearchedNumber(number, numberData);
}

const displayResearchedNumber = (number, data)=>{
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

const hideResearchTable = () =>{
    const table = document.querySelector('.c-result');

    table.classList.add('h-hide');
    deleteResearchResults();
    removeBlur();
}

const deleteResearchResults = () =>{
    const items = document.querySelectorAll('.c-result__item');

    items.forEach(item =>{
        console.log(item.lastChild)
        if(!item.lastChild.classList.contains('c-result__name')){
            item.removeChild(item.lastChild);
        }
    });
}

const isInSequence = (sequence, number) => {
    const range = [number, number];
    const digit = getDigitCount(number);
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

checkboxDigits.forEach(btn =>{
    btn.addEventListener("click", (event)=>handleCheckboxToggle(event.target));
})

selectToggler.addEventListener('click', () => {
    toggleSelectMenu();
    removeAlert();
});

researchNumberBtn.addEventListener('click', handleResearchNumber);

researchHideBtn.addEventListener('click', hideResearchTable);

max.addEventListener('click', removeAlert);

window.addEventListener('click', e => handleWindowClick(e));

function showChecked(){
    const digits = [];
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');

    checkboxItems.forEach(item => {
        item.checked ? digits.push(parseInt(item.id)) : ""
    })
    console.log(digits, "ya");
}
