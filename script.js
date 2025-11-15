/* TO TEST:
        - Open Terminal
            - type node script.js
            - press enter
*/

// binary search function
function binarySearch(array, key, lo, hi) {
    // base case
    if(lo > hi) {
        return -1
    }

    // middle calculation
    mid = (lo + hi) / 2

    // comparisons
    if(array[mid] == key) {
        return mid
    }
    else if (array[mid] < key){
        return binarySearch(array, key, mid+1, hi)
    }
    else {
        return binarySearch(array, key, lo, mid-1)
    }
}

// wrapper function
function binarySearchWrapper(array, key){
    return binarySearch(array, key, 0, array.length - 1)
}


test_1 = [1,2,3,4,5,6,7,8,9]
key_1 = 5
result_1 = binarySearchWrapper(test_1, key_1)
console.log("\nRecursive test 1: First Index\nArray: [1,2,3,4,5,6,7,8,9]\nKey: 5\nExpected Output: \n\tIndex: 4")
console.log(result_1)