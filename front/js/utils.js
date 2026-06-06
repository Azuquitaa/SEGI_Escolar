export function preventFormSubmission() {
    document.addEventListener("submit", function(e) {
        e.preventDefault();
        return false;
    });
}

export function getElement(selector) {
    return document.querySelector(selector);
}

export function getElements(selector) {
    return document.querySelectorAll(selector);
}