const { assert } = require("console");

var removeDuplicates = function (nums) {
  const map = {};

  nums.map((num, index) => {
    map[num] = index;
  });

  const mapKeys = Object.keys(map).map((i) => parseInt(i));

  for (let i = 0; i < mapKeys.length; i++) {
    nums[i] = parseInt(mapKeys[i]);
  }

  return mapKeys.length;
};

const nums = [1, 1, 2]; // Input array
const expectedNums = [1, 2]; // The expected answer with correct length

const k = removeDuplicates(nums); // Calls your implementation
console.log(k); // Print the length of the modified array
assert(k == expectedNums.length);
console.log("nums = ", nums); // Print the modified array
for (let i = 0; i < k; i++) {
  assert(nums[i] == expectedNums[i]);
}
