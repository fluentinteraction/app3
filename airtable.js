const airtableApiKey = 'patbmGeSlLVLQyp3r.9ff9b009853c2c0a1232bda0220d640cca61257877c22b25336850c6b62775a5';
const airtableBaseId = 'appz5FTUV9lRIrVnX';
const airtableTableName = 'tbl6c1vtMHKAdvW0y';

async function createToolkitRecord(code, businessSize) {
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
    const data = {
        fields: {
            "ID": code,
            "Business size": businessSize,
            "Task 1": "Not complete",
            "Task 2": "Not complete",
            "Task 3": "Not complete",
            "Task 4": "Not complete",
            "Task 5": "Not complete",
            "Task 6": "Not complete"
        }
    };

    console.log('Creating toolkit record:', data);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating record:', errorData);
        throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Toolkit record created:', responseData);
    return responseData;
}

async function updateTaskStatus(code, task, status) {
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
    const records = await fetch(`${url}?filterByFormula={ID}='${code}'`, {
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`
        }
    }).then(res => res.json());

    if (records.records.length === 0) {
        throw new Error('Record not found');
    }

    const recordId = records.records[0].id;
    const data = {
        fields: {
            [task]: status
        }
    };

    const response = await fetch(`${url}/${recordId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating record:', errorData);
        throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Task status updated:', responseData);
    return responseData;
}

async function retrieveToolkit(code) {
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
    const records = await fetch(`${url}?filterByFormula={ID}='${code}'`, {
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`
        }
    }).then(res => res.json());

    if (records.records.length === 0) {
        throw new Error('Record not found');
    }
 
    return records.records[0].fields;
}

function saveToSessionStorage(code, toolkit) {
    sessionStorage.setItem('userCode', code);
    sessionStorage.setItem(code, JSON.stringify(toolkit));
}

function loadFromSessionStorage(code) {
    const data = sessionStorage.getItem(code);
    return data ? JSON.parse(data) : null;
}

export { createToolkitRecord, updateTaskStatus, retrieveToolkit, saveToSessionStorage, loadFromSessionStorage };
