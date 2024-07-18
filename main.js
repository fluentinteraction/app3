// main.js
import { createToolkitRecord, retrieveToolkit, updateTaskStatus } from './airtable.js';
import { words } from './words.js';

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-NYJFTSXW0K', {
    'send_page_view': true,
    'debug_mode': true
});

window.setUserId = function() {
    let code = sessionStorage.getItem('userCode');
    console.log('Retrieved userCode from sessionStorage:', code);
    if (code && code !== 'Undefined') {
        gtag('set', {'user_id': code});
        console.log('GA4 set user_id:', code);
    } else {
        console.log('GA4 config without user_id');
    }
}

window.signOut = function() {
    sessionStorage.setItem('userCode', 'Undefined');
    sessionStorage.removeItem('businessSize');
    console.log('Reset userCode to Undefined');

    gtag('set', {'user_id': null});
    console.log('GA4 reset with user_id null');

    window.location.reload();
}

window.displayUserCode = function() {
    const code = sessionStorage.getItem('userCode');
    const codeDisplay = document.getElementById('user-code-display');
    const codeSection = document.getElementById('code-section');
    const retrieveSection = document.getElementById('retrieve-section');
    const actionsSection = document.getElementById('actions-section');
    console.log('Display userCode:', code);

    if (code && code !== 'Undefined') {
        codeDisplay.textContent = `Your code: ${code}`;
        codeSection.style.display = 'block';
        retrieveSection.style.display = 'none';
        actionsSection.style.display = 'block';
    } else {
        codeSection.style.display = 'none';
        retrieveSection.style.display = 'block';
        actionsSection.style.display = 'none';
    }
}

window.onload = function() {
    displayUserCode();
    setUserId();
    updateTaskStatusDisplay();
}

window.createNewToolkit = async function() {
    const code = generateCode();
    const businessSize = document.getElementById('business-size').value;
    if (businessSize === 'Please select') {
        alert('Please select your business size.');
        return;
    }
    try {
        const result = await createToolkitRecord(code, businessSize);
        console.log('Toolkit record creation result:', result);
        sessionStorage.setItem('userCode', code);
        sessionStorage.setItem('businessSize', businessSize);
        gtag('set', {'user_id': code});
        console.log('Set user_id in GA4:', code);
        window.location.reload();
    } catch (error) {
        console.error('Error creating toolkit record:', error);
    }
}

window.retrieveExistingToolkit = async function() {
    const code = document.getElementById('user-code').value.trim();
    if (!code) {
        alert('Please enter your unique code.');
        return;
    }

    try {
        const toolkit = await retrieveToolkit(code);
        saveToSessionStorage(code, toolkit);
        sessionStorage.setItem('businessSize', toolkit['Business size']);
        gtag('set', {'user_id': code});
        console.log('Retrieve and set user_id in GA4:', code);
        window.location.reload();
    } catch (error) {
        console.error('Error retrieving toolkit:', error);
        alert('Toolkit not found.');
    }
}

window.updateActionStatus = async function(task, status) {
    const code = sessionStorage.getItem('userCode');
    if (!code) {
        alert('No toolkit code found. Please get a new toolkit or retrieve an existing one.');
        return;
    }

    try {
        const result = await updateTaskStatus(code, task, status);
        console.log('Task status updated:', result);
        let toolkit = JSON.parse(sessionStorage.getItem(code)) || {};
        toolkit[task] = status;
        sessionStorage.setItem(code, JSON.stringify(toolkit));
        gtag('event', 'task_status_update', {
            'task': task,
            'status': status,
            'user_id': code
        });
        document.getElementById(`status-${task}`).textContent = status.toUpperCase();
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

function updateTaskStatusDisplay() {
    const code = sessionStorage.getItem('userCode');
    if (code && code !== 'Undefined') {
        const toolkit = JSON.parse(sessionStorage.getItem(code)) || {};
        setStatus('Task 1', toolkit['Task 1']);
        setStatus('Task 2', toolkit['Task 2']);
        setStatus('Task 3', toolkit['Task 3']);
        setStatus('Task 4', toolkit['Task 4']);
        setStatus('Task 5', toolkit['Task 5']);
        setStatus('Task 6', toolkit['Task 6']);
    }
}

function setStatus(task, status) {
    const statusElement = document.getElementById(`status-${task}`);
    status = status || 'NOT COMPLETE';
    statusElement.textContent = status.toUpperCase();

    statusElement.classList.remove('not-complete', 'complete', 'skipped');
    if (status.toUpperCase() === 'COMPLETE') {
        statusElement.classList.add('complete');
    } else if (status.toUpperCase() === 'SKIPPED') {
        statusElement.classList.add('skipped');
    } else {
        statusElement.classList.add('not-complete');
    }
}

function saveToSessionStorage(code, toolkit) {
    sessionStorage.setItem('userCode', code);
    sessionStorage.setItem(code, JSON.stringify(toolkit));
}

function generateCode() {
    return words[Math.floor(Math.random() * words.length)] + '-' + 
           words[Math.floor(Math.random() * words.length)] + '-' + 
           words[Math.floor(Math.random() * words.length)];
}
