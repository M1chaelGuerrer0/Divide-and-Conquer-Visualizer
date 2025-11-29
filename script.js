// snapshot:
//     Stores the steps taken
var snap = ""; 
function snapshot(array, lo, mid, hi) {
    const cellWidth = 56;
    const cellPadding = 10;
    const gap = 1;
    const border = 2;

    snap += `<div style="display:inline-block; margin-bottom:25px;">`;

    // ARRAY ROW
    snap += `<div style="display:flex;">`;
    for (let i = 0; i < array.length; i++) {
        let bg = (i < lo || i > hi) ? "#ddd" : "#fff";

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
        snapshot(array, lo, -1, hi, `Key not found in this range.`);
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
    const temp = document.getElementById('array').value;
    const array = temp.split(',').map(Number);
    const key = Number(document.getElementById('key').value);

    const result = binarySearch(array, key, 0, array.length - 1);
    
    // Show snapshots
    document.getElementById('snapshot').innerHTML = snap;
    snap = ""; // reset

    // final message
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

