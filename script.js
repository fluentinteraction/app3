window.onload = function() {
    var code = localStorage.getItem('custom_user_id');
    if (!code) {
        window.location.href = 'index.html';
    }
};

function loadTasks() {
    var code = localStorage.getItem('custom_user_id');
    document.getElementById('generated-code').textContent = code;
    populateUpdateDropdowns();
}

function saveCodeToLocalStorage(code) {
    localStorage.setItem('custom_user_id', code);
    window.dataLayer.push({
        'event': 'login',
        'custom_user_id': code
    });
}

function copyCode() {
    var code = localStorage.getItem('custom_user_id');
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard");
}

function resetCode() {
    localStorage.removeItem('custom_user_id');
    window.location.href = 'index.html';
}

function populateUpdateDropdowns() {
    var statuses = ['Not complete', 'Complete', 'Skipped'];
    var dropdowns = document.querySelectorAll('select[id$="-update"]');
    dropdowns.forEach(function(dropdown) {
        statuses.forEach(function(status) {
            var option = document.createElement('option');
            option.value = status;
            option.text = status;
            dropdown.appendChild(option);
        });
    });
}

function updateStatus(taskId) {
    var dropdown = document.getElementById(taskId + '-update');
    var status = dropdown.value;
    if (status !== 'Select...') {
        document.getElementById(taskId + '-status').textContent = status;
        document.getElementById(taskId + '-status').className = status.toLowerCase().replace(' ', '-');
        
        // Push the status update event to dataLayer
        window.dataLayer.push({
            'event': 'status_updated',
            'task_id': taskId,
            'status': status
        });
    } else {
        alert("Please select a valid status.");
    }
}
