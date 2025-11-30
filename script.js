// snapshot:
//     Stores the steps taken
var snapshots = [];
var finalMsg = "";
var current = 0; // current step in timeline
function snapshot(array, lo, mid, hi, found = false) {
    const cellWidth = 56;
    const gap = 1;
    const border = 2;

    let html = '';

    html += `<div style="display:inline-block; margin-bottom:10px;">`;

    // ====== ARRAY ROW ======
    html += `<div style="display:flex; overflow-x:auto;">`;
    for (let i = 0; i < array.length; i++) {
        let bg = (i < lo || i > hi) ? "#ff5656ff" : "#fff";

        // mid highlight
        if (i === mid && mid !== -1 && !found) {
            bg = "#FFFF00"; // yellow
        }

        // found highlight
        if (found && i === mid) {
            bg = "#90EE90"; // light green
        }

        html += `
            <div style="
                width:${cellWidth}px;
                height:${cellWidth}px;
                display:flex;
                justify-content:center;
                align-items:center;
                margin-right:${gap}px;
                border:${border}px solid #000;
                background:${bg};
                box-sizing:border-box;
                font-size:20px;
                font-family:Arial, sans-serif;
            ">
                ${array[i]}
            </div>
        `;
    }
    html += `</div>`;

    // ====== LABEL ROW (Low / Mid / High) ======
    html += `<div style="display:flex; margin-top:5px; height:48px; align-items:flex-start;">`;

    for (let i = 0; i < array.length; i++) {
        let labels = [];
        if (i === lo) labels.push("Low");
        if (i === mid && mid !== -1) labels.push("Mid");
        if (i === hi) labels.push("High");

        const content = labels.length ? labels.join("<br>") : "&nbsp;";

        html += `
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

    html += `</div>`;       // end label row
    html += `</div>`;       // end snapshot block

    // store this full snapshot
    snapshots.push(html);
}

function renderTimeline() {
    const snapshotDiv = document.getElementById('snapshot');
    const controlsDiv = document.getElementById('timelineControls');
    

    if (snapshots.length === 0) {
        snapshotDiv.innerHTML = "";
        controlsDiv.innerHTML = "";
        return;
    }

    let current = 0;

function showStep(index) {
    current = index;
    snapshotDiv.innerHTML = snapshots[index];

    

    const label = document.getElementById('stepLabel');
    if (label) {
        label.textContent = `Step ${index + 1} of ${snapshots.length}`;
    }

    const slider = document.getElementById('stepSlider');
    if (slider) {
        slider.value = index;
    }

    // only show the result text on the final snapshot
    const resultDiv = document.getElementById('result');
    const visibility = (current === snapshots.length - 1) ? "visible" : "hidden";
    resultDiv.innerHTML = `
        <div style="
            font-size:22px;
            font-family:Arial, sans-serif;
            font-weight:bold;
            margin-top:10px;
            visibility:${visibility};
        ">
            ${finalMsg}
        </div>
    `;
}

    // build controls UI
    controlsDiv.innerHTML = `
        <div style="margin-top:10px; font-family:Arial, sans-serif;">
            <button id="prevStep" style="margin-right:5px;">Prev</button>
            <input type="range"
                   id="stepSlider"
                   min="0"
                   max="${snapshots.length - 1}"
                   value="0"
                   style="width:300px; vertical-align:middle;">
            <button id="nextStep" style="margin-left:5px;">Next</button>
            <span id="stepLabel" style="margin-left:10px; font-size:14px;">
                Step 1 of ${snapshots.length}
            </span>
        </div>
    `;

    // wire up events
    document.getElementById('stepSlider').addEventListener('input', function () {
        const value = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.setProperty('--value', value + '%');
        showStep(parseInt(this.value, 10));
    });

    document.getElementById('prevStep').addEventListener('click', function () {
        if (current > 0) showStep(current - 1);
    });

    document.getElementById('nextStep').addEventListener('click', function () {
        if (current < snapshots.length - 1) {
            showStep(current + 1);
        }
    });

    // show first step
    showStep(0);
    const slider = document.getElementById('stepSlider');
    slider.style.setProperty('--value', '0%');
}



// binary search function
function binarySearch(array, key, lo, hi) {
    if(lo > hi) {
        snapshot(array, lo, -1, hi, `Key not found in this range.`);
        return -1;
    }

    // middle calculation
    mid = Math.floor((lo + hi) / 2);

    // current values saved
    snapshot(array, lo, mid, hi);

    // comparisons
    if(array[mid] == key) {
        snapshot(array, lo, mid, hi, true);
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
        document.getElementById('timelineControls').innerHTML = "";
        snapshots = [];
        finalMsg = "";
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

    // reset old snapshots
    snapshots = [];
    finalMsg = "";

    // gather results from current array and key    
    const result = binarySearch(array, key, 0, array.length - 1);

    // message for when index is found
    finalMsg = (result === -1)
    ? `Key ${key} was NOT found in the array.`
    : `Key ${key} was found at index ${result}.`;

    // set up the timeline UI and show the first step
    renderTimeline();

    // clear the result area for now; showStep() will fill it on the last step
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = "";}
}
