// Define a function that removes the "test/" prefix from a file path
function removeTestPrefix(testFile) {
const prefix = 'test/';
return testFile.startsWith(prefix) ? testFile.substring(prefix.length) : testFile;
}

// Export the removeTestPrefix function
module.exports = removeTestPrefix;
