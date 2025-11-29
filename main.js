// snapshotBS:
//     Stores the steps taken
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

