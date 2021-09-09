'use strict';

const submitBtn = document.querySelector(".submit");
const selectToggler = document.querySelector('.c-dropdown');
const selectOptions = document.querySelectorAll(".c-dropdown__option");
const checkboxDigits = document.querySelectorAll(".js-digits__check");
const pageNextBtn = document.querySelector('.js-pagination__next');
const pagePreviousBtn = document.querySelector('.js-pagination__previous');
const pageNumberBtn = document.querySelectorAll('.js-pagination__page');
const max = document.getElementById('max');

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
        if (!btn.parentNode.classList.contains("h-pushed") && btn.checked){
            btn.checked = false;
        }
    }
    removeAlert();
}

const handleWindowClick = e => {
    const select = document.querySelector('.c-dropdown__select')
    if (!select.contains(e.target)) {
        select.classList.remove('open');
    }
}


submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleClickGenerateList();
})

selectToggler.addEventListener('click', () => {
    toggleSelectMenu();
    removeAlert();
});

for (const option of selectOptions) {
    option.addEventListener('click', (e) => selectItem(e));
}

checkboxDigits.forEach(btn => {
    btn.addEventListener("click", (event) => handleCheckboxToggle(event.target));
})

pageNextBtn.addEventListener('click', displayNextPage);

pagePreviousBtn.addEventListener('click', displayPreviousPage);

pageNumberBtn.forEach((number) => {
    number.addEventListener('click', (e) => displayClickedPage(e));
});

max.addEventListener('click', removeAlert);

window.addEventListener('click', e => handleWindowClick(e));
