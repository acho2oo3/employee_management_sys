// app.js

function addEmployee() {
    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const workDescription = document.getElementById('workDescription').value;
    const location = document.getElementById('location').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const date = document.getElementById('date').value;
    const dateend = document.getElementById('dateend').value;
  
    const newEmployee = {
      name,
      employeeId,
      workDescription,
      location,
      vehicleNumber,
      date,
      dateend
    };
  
    // Send data to the server
    addEmployeeToServer(newEmployee);
  }
  
 
  
  function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';
  
    if (results.length > 0) {
      const ul = document.createElement('ul');
      results.forEach(result => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Name:</strong> ${result.name}<br>
                        <strong>Employee ID:</strong> ${result.employeeId}<br>
                        <strong>Work Description:</strong> ${result.workDescription}<br>
                        <strong>Location:</strong> ${result.location}<br>
                        <strong>Vehicle Number:</strong> ${result.vehicleNumber}<br>
                        <strong>Date:</strong> ${result.date}<br>`;
        ul.appendChild(li);
      });
      searchResultsDiv.appendChild(ul);
    } else {
      searchResultsDiv.innerHTML = '<p>No results found.</p>';
    }
  }
  function addEmployeeToServer(newEmployee) {
    console.log(newEmployee);
  
    // Send a POST request to the server endpoint for adding employees
    fetch('/addEmployee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEmployee)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Make sure to return the JSON data
    })
    .then(data => {
      // Show success message (you can customize this part)
      clearFormFields();
      alert('Employee added successfully!');
    // Call clearFormFields after success
    })
    .catch(error => {
      // Show error message (you can customize this part)
      alert('Error adding employee. Please try again.');
    });
}

function clearFormFields() {
    const formFields = document.getElementsByClassName('form-input');
    for (let i = 0; i < formFields.length; i++) {
        formFields[i].value = '';
    }
}
function searchEmployee() {
  const employeeId = document.getElementById('searchInput').value;
  const date = document.getElementById('startDate').value;
  const dateend = document.getElementById('endDate').value;

  const searchQuery = {
    employeeId,
    date,
    dateend
  };

  searchEmployeeOnServer(searchQuery);
}

function searchEmployeeOnServer(searchQuery) {
  // Send a POST request to the server endpoint for searching employees
  fetch('/getEmployee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(searchQuery)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(results => {
      console.log('Search results:', results);
      displaySearchResults(results);
    })
    .catch(error => {
      console.error('Error searching for employee:', error);
    });
}
