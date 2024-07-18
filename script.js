const baseId = 'appz5FTUV9lRIrVnX';
const tableId = 'tbl6c1vtMHKAdvW0y';
const apiKey = 'patbmGeSlLVLQyp3r.9ff9b009853c2c0a1232bda0220d640cca61257877c22b25336850c6b62775a5';
let words = []; // This will be populated from the words.js file

// Load the words from words.js
function loadWords() {
    if (typeof wordsArray !== 'undefined') {
        words = wordsArray; // `wordsArray` should be defined in words.js
    } else {
        console.error('wordsArray is not defined. Ensure words.js is loaded correctly.');
    }
}

// Generate a 3-random-word code
function generateCode() {
    const size = document.getElementById('business-size').value;
    const code = `${words[Math.floor(Math.random() * words.length)]}${words[Math.floor(Math.random() * words.length)]}${words[Math.floor(Math.random() * words.length)]}`;
    sessionStorage.setItem('businessSize', size);
    sessionStorage.setItem('code', code);
    displayCode(code);
    saveToAirtable(code, size);
}

function displayCode(code) {
    document.getElementById('get-toolkit').style.display = 'none';
    document.getElementById('retrieve-toolkit').style.display = 'none';
    document.getElementById('toolkit-display').style.display = 'block';
    document.getElementById('tasks-table').style.display = 'block';
    document.getElementById('generated-code').textContent = code;
}

function copyCode() {
    const code = document.getElementById('generated-code').textContent;
    navigator.clipboard.writeText(code);
}

function resetCode() {
    sessionStorage.clear();
    document.getElementById('get-toolkit').style.display = 'block';
    document.getElementById('retrieve-toolkit').style.display = 'block';
    document.getElementById('toolkit-display').style.display = 'none';
    document.getElementById('tasks-table').style.display = 'none';
}

function updateStatus(taskId) {
    const status = document.getElementById(`${taskId}-update`).value;
    document.getElementById(`${taskId}-status`).textContent = status;
    const code = sessionStorage.getItem('code');
    const size = sessionStorage.getItem('businessSize');
    saveToAirtable(code, size);
}

function saveToAirtable(code, size) {
    const data = {
        fields: {
            ID: code,
            Size: size,
            'Task 1': document.getElementById('task1-status').textContent,
            'Task 2': document.getElementById('task2-status').textContent,
            'Task 3': document.getElementById('task3-status').textContent,
            'Task 4': document.getElementById('task4-status').textContent,
            'Task 5': document.getElementById('task5-status').textContent,
            'Task 6': document.getElementById('task6-status').textContent,
        }
    };

    axios.post(`https://api.airtable.com/v0/${baseId}/${tableId}`, data, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('Data saved to Airtable:', response.data);
    }).catch(error => {
        console.error('Error saving to Airtable:', error);
    });
}

function retrieveToolkit() {
    const code = document.getElementById('code-input').value;
    sessionStorage.setItem('code', code);
    displayCode(code);
}

window.onload = loadWords;
