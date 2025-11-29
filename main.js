// ============ Binary Search =============
// snapshotBS: imple snapshot for binary search
var snap = ""; 
function snapshotBS(array, lo, mid, hi, found = false) {
    const cellWidth = 56;
    const cellPadding = 10;
    const gap = 1;
    const border = 2;

    snap += `<div style="display:inline-block; margin-bottom:25px;">`;

    // ARRAY ROW
    snap += `<div style="display:flex;">`;
    for (let i = 0; i < array.length; i++) {
        let bg = (i < lo || i > hi) ? "#ddd" : "#fff";

        // Make the box green if this is the found element
        if (found && i === mid) {
            bg = "#90EE90"; // Light green color
        }

        snap += `
            <div style="
                width:${cellWidth}px;
                padding:${cellPadding}px 0;
                margin-right:${gap}px;
                border:${border}px solid #333;
                border-radius:6px;
                text-align:center;
                font-size:20px;
                font-family:Arial, sans-serif;
                background-color:${bg};
                box-sizing:border-box;
            ">
                ${array[i]}
            </div>
        `;
    }
    snap += `</div>`;

    // LABEL ROW {low, mid, high}
    snap += `<div style="display:flex; margin-top:5px;">`;

    for (let i = 0; i < array.length; i++) {
        let labels = [];
        if (i === lo) labels.push("Low");
        if (i === mid && mid !== -1) labels.push("Mid");
        if (i === hi) labels.push("High");

        let content = labels.length ? labels.join("<br>") : "&nbsp;";

        snap += `
            <div style="
                width:${cellWidth}px;
                margin-right:${gap}px;
                text-align:center;
                font-size:14px;
                font-weight:bold;
                font-family:Arial, sans-serif;
                line-height:1.1;
                color:${labels.length ? "black" : "transparent"};
            ">
                ${content}
            </div>
        `;
    }

    snap += `</div>`;

    snap += `</div><br><br>`;
}


// binary search function
function binarySearch(array, key, lo, hi) {
    if(lo > hi) {
        snapshotBS(array, lo, -1, hi, `Key not found in this range.`);
        return -1;
    }

    // middle calculation
    mid = Math.floor((lo + hi) / 2);

    // current values saved
    snapshotBS(array, lo, mid, hi);

    // comparisons
    if(array[mid] == key) {
        snapshotBS(array, lo, mid, hi, true);
        return mid;
    }
    else if (array[mid] < key){
        return binarySearch(array, key, mid+1, hi);
    }
    else {
        return binarySearch(array, key, lo, mid-1);
    }
}



/*  Wrapper function:
        - Takes the inputs, verifies them, sends to binarySearch funtion.
        - Gets the result and snapshots of the steps taken.
        - Displays the steps and final result.
*/
function binarySearchWrapper(){
    const key = document.getElementById('key').value;
    const array_string = document.getElementById('array').value.split(',').map(str => str.trim());

    // Check if all array elements are integers
    const arrayIntegers = array_string.every(item => /^-?\d+$/.test(item));
    if (!arrayIntegers) {
        document.getElementById('result').innerHTML = `
            <div style="
                color: red;
                font-size: 22px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                margin-top: 10px;
            ">
                Error: Array must contain only integers, separated by commas.
            </div>
        `;
        document.getElementById('snapshot').innerHTML = "";
        snap = "";
        return;
    }

    // Convert array to actual integers
    const array = array_string.map(Number);

    // Check if array is sorted
    const sortedCopy = [...array].sort((a, b) => a - b);
    const isSorted = array.every((value, index) => value === sortedCopy[index]);
    if (!isSorted) {
        document.getElementById('result').innerHTML = `
            <div style="
                color: red;
                font-size: 22px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                margin-top: 10px;
            ">
                Error: The array must be sorted before using binary search.
            </div>
        `;
        document.getElementById('snapshot').innerHTML = "";
        snap = "";
        return;
    }

    // gather results from current array and key    
    const result = binarySearch(array, key, 0, array.length - 1);

    // Show snapshots
    document.getElementById('snapshot').innerHTML = snap;
    snap = "";

    // Show final message
    const msg = (result === -1)
      ? `Key ${key} was NOT found in the array.`
      : `Key ${key} was found at index ${result}.`;

    document.getElementById('result').innerHTML = `
        <div style="
            font-size:22px;
            font-family:Arial, sans-serif;
            font-weight:bold;
            margin-top:10px;
        ">
            ${msg}
        </div>
    `;
}
// ========= End of Binary Search ==========

// =============== Merge Sort ===============

// snapshotMS: imple snapshot for merge sort
var snapMS = "";
function snapshotMS(arrays, step = "") {
    const cellWidth = 45;
    const cellPadding = 6;
    const gap = 2;

    snapMS += `<div style="margin-bottom:20px; text-align:center;">`;

    // step description
    if (step) {
        snapMS += `<div style="font-size:16px; font-family:Arial, sans-serif; margin-bottom:10px; color:#333; font-weight:bold;">${step}</div>`;
    }

    // container
    snapMS += `<div style="display:flex; justify-content:center; gap:30px; align-items:flex-start;">`;
    
    arrays.forEach((array, index) => {
        if (array.length > 0) { // Only show non-empty arrays
            snapMS += `<div style="display:flex; flex-direction:column; align-items:center;">`;
            
            // Array label (Left/Right)
            if (arrays.length > 1) {
                const label = index === 0 ? "Left" : "Right";
                snapMS += `<div style="font-size:14px; margin-bottom:5px; color:#666;">${label}</div>`;
            }
            
            // ARRAY ROW
            snapMS += `<div style="display:flex;">`;
            array.forEach(value => {
                snapMS += `
                    <div style="
                        width:${cellWidth}px;
                        padding:${cellPadding}px 0;
                        margin-right:${gap}px;
                        border:2px solid #333;
                        border-radius:4px;
                        text-align:center;
                        font-size:16px;
                        font-family:Arial, sans-serif;
                        background-color:#fff;
                        font-weight:bold;
                    ">
                        ${value}
                    </div>
                `;
            });
            snapMS += `</div>`;
            snapMS += `</div>`;
        }
    });
    
    snapMS += `</div>`;
    snapMS += `</div>`;
}

// merge
function merge(left, right) {
    let result = [];
    let i = 0, j = 0;
    
    // merging 
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // add remaining elements
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    
    return result;
}

// mergeSort
function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }

    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);

    // show division
    snapshotMS([left, right], `Dividing into halves:`);

    // recursively sort left and right
    const left_sorted = mergeSort(left);
    const right_sorted = mergeSort(right);

    // merge the sorted halves
    const merged = merge(left_sorted, right_sorted);
    
    // show merged result
    snapshotMS([merged], `Merged result:`);
    snapMS += `<div style="height:15px; border-bottom:1px solid #ccc; margin:10px 0;"></div>`; // Separator
    
    return merged;
}

function mergeSortWrapper(){
    const array_string = document.getElementById('array').value.split(',').map(str => str.trim());

    // check if all array elements are integers
    const arrayIntegers = array_string.every(item => /^-?\d+$/.test(item));
    if (!arrayIntegers) {
        document.getElementById('result').innerHTML = `
            <div style="
                color: red;
                font-size: 22px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                margin-top: 10px;
            ">
                Error: Array must contain only integers, separated by commas.
            </div>
        `;
        document.getElementById('snapshot').innerHTML = "";
        snapMS = "";
        return;
    }

    // convert array to actual integers
    const array = array_string.map(Number);

    
    
    // show initial array
    snapMS += `<div style="text-align:center; margin-bottom:20px;">`;
    snapMS += `<div style="font-size:18px; font-weight:bold; margin-bottom:10px;">Original Array:</div>`;
    snapshotMS([array]);
    snapMS += `<div style="height:20px; border-bottom:2px solid #999; margin:20px 0;"></div>`;
    snapMS += `</div>`;
    
    const sortedArray = mergeSort(array);
    
    // show final sorted array
    snapMS += `<div style="text-align:center; margin-top:30px;">`;
    snapMS += `<div style="font-size:20px; font-weight:bold; margin:20px 0 10px 0; color:#2E8B57;">Final Sorted Array:</div>`;
    snapshotMS([sortedArray]);
    snapMS += `</div>`;
    document.getElementById('snapshot').innerHTML = snapMS;
}

// ============ End of Merge Sort ============