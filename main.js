/*
    Snapshot method is used to capture steps taken in binary search.
    Each snapshot is stored as an HTML string in the snapshots array.
    The renderTimeline() function displays these snapshots with navigation controls.
*/
var snapshots = [];
var finalMsg = "";
function snapshot(array, lo, mid, hi, message="", found = false) {
    const cellWidth = 56;
    const gap = 1;
    const border = 2;

    let html = '';

    html += `<div style="display:inline-block; margin-bottom:10px;">`;


    // ====== COMPARISON MESSAGE ======
    if (message) {
        html += `<div style="
            font-size:16px;
            font-weight:bold;
            margin-bottom:10px;
            color:#e5e7eb;
            text-align:center;
            font-family:Arial, sans-serif;
        ">
            ${message}
        </div>`;
    }


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

// update slider background
function updateSliderBackground(slider) {
    const min = Number(slider.min) || 0;
    const max = Number(slider.max) || 1;
    const value = Number(slider.value);
    const percent = ((value - min) * 100) / (max - min);
    slider.style.setProperty('--value', percent + '%');
}

// render timeline UI
function renderTimeline() {
    const snapshotDiv = document.getElementById('snapshot');
    const controlsDiv = document.getElementById('timelineControls');

    if (snapshots.length === 0) {
        snapshotDiv.innerHTML = "";
        controlsDiv.innerHTML = "";
        return;
    }

    let current = 0;
    // show a specific step
    function showStep(index) {
        current = index;
        console.log("Highlighting code for step:", index);
        highlightCodeLineWrapper(index);
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
                const percent = (current - 1)  / (snapshots.length - 1) * 100;
                slider.style.setProperty('--value', percent + '%');
                showStep(current - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (current < snapshots.length - 1) {
                const percent = (current + 1)  / (snapshots.length - 1) * 100;
                slider.style.setProperty('--value', percent + '%');
                showStep(current + 1);
            }
        });
    }

    if (firstBtn) {
        firstBtn.addEventListener('click', () => {
            const percent = 0;
            slider.style.setProperty('--value', percent + '%');
            showStep(0);
        });
    }

    if (lastBtn) {
        lastBtn.addEventListener('click', () => {
            const percent = 100;
            slider.style.setProperty('--value', percent + '%');
            showStep(snapshots.length - 1);
        });
    }

    // initially show the first step
    showStep(0);
}

/*
    Binary Search Algorithm with Snapshots
*/
function binarySearch(array, key, lo, hi) {
    if (lo > hi) {
        snapshot(array, lo, -1, hi, "Low > High: Search Range Empty");
        return -1;
    }

    // middle calculation
    const mid = Math.floor((lo + hi) / 2);

    // current values saved
    snapshot(array, lo, mid, hi, `Checking Mid: ${array[mid]} =? ${key}`);

    // comparisons
    if (array[mid] == key) {
        // current values saved with found highlight
        snapshot(array, lo, mid, hi, `${array[mid]} == ${key}`, true);
        return mid;
    } else if (array[mid] < key) {
        // current values saved with search right highlight
        snapshot(array, lo, mid, hi, `${array[mid]} < ${key}: Search Right`);
        return binarySearch(array, key, mid + 1, hi);
    } else {
        // current values saved with search left highlight
        snapshot(array, lo, mid, hi, `${array[mid]} > ${key}: Search Left`);
        return binarySearch(array, key, lo, mid - 1);
    }
}

/*  
    Wrapper function:
        the main binary search function that handles input validation,
        resets snapshots, and initiates the search and timeline rendering.
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
}

// Simple toggle for pseudo-code panel
document.addEventListener('DOMContentLoaded', function() {
  const codePanel = document.getElementById('codePanel');
  const codeTitle = document.getElementById('codeTitle');
  
  if (codePanel && codeTitle) {
    // Toggle panel when title is clicked
    codeTitle.addEventListener('click', function() {
      codePanel.classList.toggle('collapsed');
      const toggleIcon = codeTitle.querySelector('.toggle-icon');
      if (toggleIcon) {
        toggleIcon.textContent = codePanel.classList.contains('collapsed') ? '▼' : '▲';
      }
    });
    
    // Initially show as collapsed
    codePanel.classList.add('collapsed');
  }
});


function highlightCodeLineWrapper(index) {
console.log(snapshots[index][0]);
  const html = snapshots[index]; // this is your big HTML string

  const temp = document.createElement('div');
  temp.innerHTML = html;

  // adjust this selector to match how you actually built the message div
  const msgDiv = temp.querySelector('div > div'); // e.g. outer div then inner message div

  if (!msgDiv) return null;

  const final_msg = msgDiv.textContent.trim();
  console.log("Final message extracted:", final_msg);

  if (final_msg.includes("Checking Mid")) {
    highlightCodeLine(10);
  }
  if (final_msg.includes("Search Right")) {
    highlightCodeLine(14);
  }
  if (final_msg.includes("Search Left")) {
    highlightCodeLine(17);
  }
  if (final_msg.includes("Search Range Empty")) {
    highlightCodeLine(4);
}
  if (final_msg.includes("==")) {
    highlightCodeLine(11);
    }
}

function highlightCodeLine(lineNumbers) {
    if (!Array.isArray(lineNumbers)) {
    lineNumbers = [lineNumbers];
  }
    document
    .querySelectorAll('#codeLines .code-line.highlight')
    .forEach(el => el.classList.remove('highlight'));

    lineNumbers.forEach(num => {
    const lineEl = document.querySelector(`#codeLines .code-line[data-line="${num}"]`);
    if (lineEl) {
      lineEl.classList.add('highlight');
    }
  });

}
//================ End of Binary Search ===============

// =============== Merge Sort ===============

// Global snapshot variable
var snapMS = "";

/*
    Snapshot method for Merge Sort visualization.
    Shows multiple arrays as separate groups without brackets
*/
function snapshotMS(arrays) {
    snapMS += `<div class="merge-step">`;

    // container for all array boxes
    snapMS += `<div class="arrays-container">`;
    
    arrays.forEach((array) => {
        // Individual array box
        snapMS += `<div class="array-box">`;
        
        // Elements inside the array
        array.forEach((value) => {
            snapMS += `
                <div class="array-element">
                    ${value}
                </div>
            `;
        });
        
        snapMS += `</div>`;
    });
    
    snapMS += `</div>`;
    snapMS += `</div>`;
}

/*
    Merge function
*/
function merge(left, right) {
    let result = [];
    let i = 0, j = 0;
    
    // Merge elements from left and right arrays
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // Append remaining elements
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

/*
    merge sort visualization with proper step-by-step splitting
*/
function mergeSortVisual(arr) {
    snapMS = "";
    
    // Step 1: Original array
    snapshotMS([arr]);
    snapMS += `<div class="step-divider"></div>`;
    
    // Show initial split if array has more than 1 element
    if (arr.length > 1) {
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        snapshotMS([left, right]);
        snapMS += `<div class="step-divider"></div>`;
        
        // Start with the split arrays
        let currentLevel = [left, right];
        
        // Keep splitting until all arrays are length 1
        while (currentLevel.some(array => array.length > 1)) {
            const nextLevel = [];
            let hasSplitThisLevel = false;
            
            for (const array of currentLevel) {
                if (array.length > 1) {
                    // Split this array
                    const mid = Math.floor(array.length / 2);
                    nextLevel.push(array.slice(0, mid), array.slice(mid));
                    hasSplitThisLevel = true;
                } else {
                    // Keep single elements
                    nextLevel.push(array);
                }
            }
            
            // Only show the level if a split actually occurred
            if (hasSplitThisLevel) {
                snapshotMS(nextLevel);
                snapMS += `<div class="step-divider"></div>`;
            }
            
            currentLevel = nextLevel;
        }
        
        // Now do merges (bottom-up)
        let currentArrays = currentLevel;
        
        while (currentArrays.length > 1) {
            const nextArrays = [];
            
            // Merge adjacent pairs
            for (let i = 0; i < currentArrays.length; i += 2) {
                if (i + 1 < currentArrays.length) {
                    nextArrays.push(merge(currentArrays[i], currentArrays[i + 1]));
                } else {
                    nextArrays.push(currentArrays[i]);
                }
            }
            
            snapshotMS(nextArrays);
            snapMS += `<div class="step-divider"></div>`;
            currentArrays = nextArrays;
        }
        
        return currentArrays[0];
    } else {
        // Array is already sorted
        return arr;
    }
}

/*
    Wrapper function for Merge Sort visualization
    Acts as the main entry point for handling input and displaying results
*/
function mergeSortWrapper() {
    // Clear previous results
    document.getElementById('result').innerHTML = "";
    document.getElementById('snapshot').innerHTML = "";
    
    const input = document.getElementById('array').value.trim();
    if (!input) {
        alert("Please enter an array");
        return;
    }
    
    const array_string = input.split(',').map(str => str.trim());
    const arrayIntegers = array_string.every(item => /^-?\d+$/.test(item));
    
    // check for integer validity
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
        return;
    }
    
    const array = array_string.map(Number);
    const sortedArray = mergeSortVisual(array);
    
    document.getElementById('snapshot').innerHTML = snapMS;
}

// ============ End of Merge Sort ============