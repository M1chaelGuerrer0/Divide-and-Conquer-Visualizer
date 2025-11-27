// snapshot
var snap = ""; 
function snapshot(array, lo, mid, hi, reason) {
    snap += `<span style="
        font-family: 'Courier New', monospace; 
        font-size: 30px; 
        font-weight: bold;
    ">List:</span> `;

    // makes the list look like an array
    snap += `<span style="display: inline-flex; margin-left: 10px;">`;
    for (let i = 0; i < array.length; i++) {
        // this makes the sub array greyed out
        let color = (i < lo || i > hi) ? "#ddd" : "#fff";  

        snap += `<div style="
            padding: 10px; 
            margin-right: 1px; 
            border: 2px solid #333; 
            border-radius: 6px; 
            text-align: center;
            font-size: 20px;
            font-family: Arial, sans-serif;
            background-color: ${color};
            min-width: 40px;
        ">${array[i]}</div>`;
    }
    snap += `</span>`;

    // low mid and high displayed
    snap += `<br><span style="
        font-size: 20px; 
        font-family: Arial, sans-serif; 
        font-weight: bold;
    ">low: ${lo}, mid: ${mid}, high: ${hi}</span><br>`;

    
    let [firstLine, secondLine] = reason.split("||");

    // Description
    snap += `<div style="
        font-size: 20px;
        font-family: Arial, sans-serif;
        font-weight: bold;
        padding: 5px 0;
    ">${firstLine}<br>${secondLine}</div><br>`;
}



// binary search function
function binarySearch(array, key, lo, hi) {
    if(lo > hi) {
        snapshot(array, lo, -1, hi, `Key not found in this range.`);
        return -1;
    }

    let mid = Math.floor((lo + hi) / 2);

    let firstLine = `array[mid] = ${array[mid]}`;
    let secondLine = "";

    if(array[mid] === key) {

        secondLine = `<br>Found key ${key} at index ${mid}.`;
    } else if(array[mid] < key) {
        secondLine = `${array[mid]} < key = ${key}, so move right (low = mid + 1)`;
    } else {
        secondLine = `${array[mid]} > key = ${key}, so move left (high = mid - 1)`;
    }

    // Combine into reason with line break handled in snapshot
    let reason = firstLine + "||" + secondLine; // using || as separator

    snapshot(array, lo, mid, hi, reason);

    if(array[mid] === key) return mid;
    else if(array[mid] < key) return binarySearch(array, key, mid+1, hi);
    else return binarySearch(array, key, lo, mid-1);
}


// wrapper function
function binarySearchWrapper(){
    const temp = document.getElementById('array').value;
    const array = temp.split(',').map(Number);
    const key = Number(document.getElementById('key').value);

    let result = binarySearch(array, key, 0, array.length - 1);
    document.getElementById('snapshot').innerHTML = snap;
    snap = "";
    //document.getElementById('result').textContent = "index: " + result;
}

