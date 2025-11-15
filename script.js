// snapshot
var snap = ""; // global variable
function snapshot(array, lo, mid, hi) {
    snap += `List: ${array.slice(lo, hi+1)}\nlo: ${lo}, mid: ${mid}, hi: ${hi}\n`;
}

// binary search function
function binarySearch(array, key, lo, hi) {
    // base case
    if(lo > hi) {
        return -1;
    }

    // middle calculation
    mid = Math.floor((lo + hi) / 2);
    snapshot(array, lo, mid, hi);
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
    // string
    const temp = document.getElementById('array').value;
    // array from string
    const array = temp.split(',').map(Number);
    // key
    const key = document.getElementById('key').value;
    
    result = binarySearch(array, key, 0, array.length - 1);
    document.getElementById('snapshot').textContent = snap;
    snap = "";
    document.getElementById('result').textContent = "index: " +result;
}
