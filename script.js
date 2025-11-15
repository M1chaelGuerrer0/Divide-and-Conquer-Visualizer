/* TO TEST:
        - Open Terminal
            - type node script.js
            - press enter
*/

// binary search function
function binarySearch(array, key, lo, hi) {
    // base case
    if(lo > hi) {
        return -1;
    }

    // middle calculation
    mid = Math.floor((lo + hi) / 2);

    // comparisons
    if(array[mid] == key) {
        return mid;
    }
    else if (array[mid] < key){
        return binarySearch(array, key, mid+1, hi);
    }
    else {
        return binarySearch(array, key, lo, mid-1);
    }
}

// wrapper function
function binarySearchWrapper(){
    const temp = document.getElementById('array').value;
    const array = temp.split(',').map(Number);
    const key = document.getElementById('key').value;
    result = binarySearch(array, key, 0, array.length - 1);
    document.getElementById('result').textContent = result;
}
