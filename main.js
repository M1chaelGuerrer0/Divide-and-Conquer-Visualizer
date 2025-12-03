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

    html += `<div style="display:inline-block; margin-bottom:10px; margin-bottom:10px;">`;

    // ====== ARRAY ROW ======
    html += `<div style="display:flex; overflow-x:auto;">`;
    for (let i = 0; i < array.length; i++) {
        // out-of-bounds highlight
        let bg = (i < lo || i > hi) ? "#A44A3F" : "#111827";
        let borderColor = (i< lo || i > hi) ? "#7f1d1d" : "4b5563";
        let textColor = (i < lo || i > hi) ? "#111827" : "#e5e7eb";

        // mid highlight
        if (i === mid) {
            bg = found ? "#69995D" : "#246A73";
            borderColor = found ? "#22c55e" : "e5e7eb";
            textColor = found ? "#022c22" : "#020617";
        }

        html += `
            <div style="
                width:${cellWidth}px;
                height:${cellWidth}px;
                display:flex;
                justify-content:center;
                align-items:center;
                margin-right:${gap}px;
                border:${border}px solid ${borderColor};
                background:${bg};
                box-sizing:border-box;
                font-size:20px;
                color:${textColor};
            ">
                ${array[i]}
            </div>
        `;
    }
    html += `</div>`;

    // ====== LABEL ROW (lo, mid, hi) ======
    html += `<div style="display:flex; margin-top:4px;">`;

    for (let i = 0; i < array.length; i++) {
        let label = '';
        let color = '#000';

        if (i === lo && i === mid && i === hi) {
            label = 'Low<br>Mid<br>High';
            color = '#e5e7eb';
        } else if (i === lo && i === mid) {
            label = 'Low<br>Mid';
            color = '#e5e7eb';
        } else if (i === mid && i === hi) {
            label = 'Mid<br>High';
            color = '#e5e7eb';
        } else if (i === lo) {
            label = 'Low';
            color = '#e5e7eb';
        } else if (i === mid) {
            label = 'Mid';
            color = '#e5e7eb';
        } else if (i === hi) {
            label = 'High';
            color = '#e5e7eb';
        }

        html += `
            <div style="
                width:${cellWidth}px;
                height:20px;
                margin-right:${gap}px;
                text-align:center;
                font-size:12px;
                color:${label ? color : 'transparent'};
                box-sizing:border-box;
            ">
                ${label}
            </div>
        `;
    }
    html += `</div>`;

    html += `</div>`;

    snapshots.push(html);
}

function updateSliderBackground(slider) {
    const min = Number(slider.min) || 0;
    const max = Number(slider.max) || 1;
    const value = Number(slider.value);
    const percent = ((value - min) * 100) / (max - min);
    slider.style.setProperty('--value', percent + '%');
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
                margin-top:15px;
                visibility:${visibility};
            ">
                ${finalMsg}
            </div>
        `;
    }

    controlsDiv.innerHTML = `
        <div style="margin-top:15px; display:flex; flex-direction:column; align-items:center;">
            <div style="margin-bottom:8px; font-size:14px;" id="stepLabel">
                Step 1 of ${snapshots.length}
            </div>
            <input
                id="stepSlider"
                type="range"
                min="0"
                max="${snapshots.length - 1}"
                value="0"
                style="width:30%; margin-bottom:10px;"
            />
            <div style="display:flex; gap:10px; justify-content:center;">
                 <button id="firstStepBtn">First</button>
                <button id="prevStepBtn">Prev</button>
                <button id="nextStepBtn">Next</button>
                <button id="lastStepBtn">Last</button>
            </div>
        </div>
    `;

    // slider controls
    const slider = document.getElementById('stepSlider');
if (slider) {
    updateSliderBackground(slider);  // initial
    slider.addEventListener('input', () => {
        showStep(parseInt(slider.value, 10));
        updateSliderBackground(slider);
    });
}




    // buttons
    const firstBtn = document.getElementById('firstStepBtn');
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const lastBtn = document.getElementById('lastStepBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (current > 0) {
                showStep(current - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (current < snapshots.length - 1) {
                showStep(current + 1);
            }
        });
    }

    if (firstBtn) {
        firstBtn.addEventListener('click', () => {
            showStep(0);
        });
    }

    if (lastBtn) {
        lastBtn.addEventListener('click', () => {
            showStep(snapshots.length - 1);
        });
    }

    // initially show the first step
    showStep(0);
}

// BINARY SEARCH functions
var mid; // current midpoint

function binarySearch(array, key, lo, hi) {
    if (lo > hi) {
        snapshot(array, lo, -1, hi, `Key not found in this range.`);
        return -1;
    }

    // middle calculation
    mid = Math.floor((lo + hi) / 2);

    // current values saved
    snapshot(array, lo, mid, hi);

    // comparisons
    if (array[mid] == key) {
        snapshot(array, lo, mid, hi, true);
        return mid;
    } else if (array[mid] < key) {
        return binarySearch(array, key, mid + 1, hi);
    } else {
        return binarySearch(array, key, lo, mid - 1);
    }
}

/*  Wrapper function:
        Uses global variable mid and push to snapshot()
*/
function binarySearchWrapper() {
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

    // Key validation: key must be a single integer
    if (!/^-?\d+$/.test(key)) {
        document.getElementById('result').innerHTML = `
            <div style="
                color: red;
                font-size: 22px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                margin-top: 10px;
            ">
                Error: Key must be a single integer.
            </div>
        `;
        document.getElementById('snapshot').innerHTML = "";
        document.getElementById('timelineControls').innerHTML = "";
        snapshots = [];
        finalMsg = "";
        return;
    }

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
                Error: Array must be sorted before using binary search.
            </div>
        `;
        document.getElementById('snapshot').innerHTML = "";
        // leftover from older implementation; harmless
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
        resultDiv.innerHTML = "";
    }
}

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
        snapMS += `<div style="font-size:16px; font-family:Arial, sans-serif; margin-bottom:10px; color:#fffff; font-weight:bold;">${step}</div>`;
    }

    // container
    snapMS += `<div style="display:flex; justify-content:center; gap:30px; align-items:flex-start;">`;
    
    arrays.forEach((array, index) => {
        if (array.length > 0) { // Only show non-empty arrays
            snapMS += `<div style="display:flex; flex-direction:column; align-items:center;">`;
            
            // Array label (Left/Right)
            if (arrays.length > 1) {
                const label = index === 0 ? "Left" : "Right";
                snapMS += `<div style="font-size:14px; margin-bottom:5px; color:#9ca3af;">${label}</div>`;
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
                        background-color:#111827;
                        color:#FFFFFF
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