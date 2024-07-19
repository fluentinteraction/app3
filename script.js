const baseId = 'appz5FTUV9lRIrVnX';
const tableId = 'tbl6c1vtMHKAdvW0y';
const apiKey = 'patbmGeSlLVLQyp3r.9ff9b009853c2c0a1232bda0220d640cca61257877c22b25336850c6b62775a5';

window.generateCode = function() {
    const size = document.getElementById('business-size').value;
    if (size && wordsArray.length > 0) {
        const code = `${wordsArray[Math.floor(Math.random() * wordsArray.length)]}${wordsArray[Math.floor(Math.random() * wordsArray.length)]}${wordsArray[Math.floor(Math.random() * wordsArray.length)]}`;
        sessionStorage.setItem('businessSize', size);
        sessionStorage.setItem('custom_user_id', code);
        document.cookie = `custom_user_id=${code}; path=/`; // Set the custom_user_id cookie
        createAirtableEntry(code, size);
    } else {
        alert('Please select a business size.');
    }
}

window.retrieveToolkit = function() {
    const code = document.getElementById('code-input').value;
    if (code) {
        sessionStorage.setItem('custom_user_id', code);
        document.cookie = `custom_user_id=${code}; path=/`; // Set the custom_user_id cookie
        window.location.href = 'tasks.html';
    } else {
        alert('Please enter a code.');
    }
}

function createAirtableEntry(code, size) {
    const data = {
        fields: {
            ID: code,
            Size: size,
            'Task 1': 'Not complete',
            'Task 2': 'Not complete',
            'Task 3': 'Not complete'
        }
    };

    axios.post(`https://api.airtable.com/v0/${baseId}/${tableId}`, data, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('Data saved to Airtable:', response.data);
        window.location.href = 'tasks.html'; // Redirect after successfully creating the entry
    }).catch(error => {
        console.error('Error saving to Airtable:', error);
    });
}

window.loadCode = function() {
    const code = sessionStorage.getItem('custom_user_id');
    if (code) {
        document.getElementById('generated-code').textContent = code;
        document.cookie = `custom_user_id=${code}; path=/`; // Set the custom_user_id cookie
        fetchRecordId(code);
    } else {
        window.location.href = 'index.html';
    }
}

function fetchRecordId(code) {
    axios.get(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        },
        params: {
            filterByFormula: `{ID}="${code}"`
        }
    }).then(response => {
        const records = response.data.records;
        if (records.length > 0) {
            recordId = records[0].id;
            console.log('Record ID:', recordId);
            loadRecordData(records[0].fields);
        } else {
            console.error('No record found with the given ID.');
        }
    }).catch(error => {
        console.error('Error fetching record ID:', error);
    });
}

function loadRecordData(fields) {
    console.log('Record Data:', fields); // Log the record data
    document.getElementById('task1-status').textContent = fields['Task 1'] || 'Not complete';
    document.getElementById('task2-status').textContent = fields['Task 2'] || 'Not complete';
    document.getElementById('task3-status').textContent = fields['Task 3'] || 'Not complete';
    updateDropdowns();
}

window.copyCode = function() {
    const code = document.getElementById('generated-code').textContent;
    navigator.clipboard.writeText(code);
}

window.resetCode = function() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

window.updateStatus = function(taskId) {
    const status = document.getElementById(`${taskId}-update`).value;
    document.getElementById(`${taskId}-status`).textContent = status;
    const code = sessionStorage.getItem('custom_user_id');
    const size = sessionStorage.getItem('businessSize');
    updateAirtableRecord(code, size);
    updateDropdowns();

    // Push the update status event to the data layer
    window.dataLayer.push({
        'event': 'update_status',
        'task_id': taskId,
        'status': status,
        'custom_user_id': code
    });

    console.log('GA4 event sent: update_status', {
        'task_id': taskId,
        'status': status,
        'custom_user_id': code
    });
}

function updateAirtableRecord(code, size) {
    const data = {
        fields: {
            ID: code,
            Size: size,
            'Task 1': document.getElementById('task1-status').textContent,
            'Task 2': document.getElementById('task2-status').textContent,
            'Task 3': document.getElementById('task3-status').textContent
        }
    };

    axios.patch(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`, data, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('Data updated in Airtable:', response.data);
    }).catch(error => {
        console.error('Error updating Airtable:', error);
    });
}

function updateDropdowns() {
    const tasks = ['task1', 'task2', 'task3'];
    tasks.forEach(task => {
        const status = document.getElementById(`${task}-status`).textContent;
        const dropdown = document.getElementById(`${task}-update`);
        dropdown.innerHTML = '<option disabled selected>Select...</option>';
        if (status === 'Not complete') {
            dropdown.innerHTML += '<option value="Complete">Complete</option><option value="Skipped">Skipped</option>';
        } else if (status === 'Complete') {
            dropdown.innerHTML += '<option value="Not complete">Not complete</option><option value="Skipped">Skipped</option>';
        } else if (status === 'Skipped') {
            dropdown.innerHTML += '<option value="Not complete">Not complete</option><option value="Complete">Complete</option>';
        }
    });
}
