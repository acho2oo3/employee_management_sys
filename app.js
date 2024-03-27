const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');  // Import the 'path' module

const app = express();
const PORT = process.env.PORT || 3000;
const uri = "mongodb+srv://achochencho:3PiknyjG899Cdj7g@cluster0.6sf1nhg.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Connect to MongoDB
// mongoose.connect('mongodb://localhost/employee_tracking', { useNewUrlParser: true, useUnifiedTopology: true });

// Create Employee schema and model
const employeeSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  workDescription: String,
  location: String,
  vehicleNumber: String,
  date: Date,
  dateend: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'views')));

// Save employee data
app.post('/addEmployee', async (req, res) => {
  try {
    const { name, employeeId, workDescription, location, vehicleNumber, date,dateend } = req.body;

    // Create a new employee instance
    const newEmployee = new Employee({
      name,
      employeeId,
      workDescription,
      location,
      vehicleNumber,
      date,
      dateend
    });

    // Save the new employee to the database
    const savedEmployee = await newEmployee.save();

    res.status(200).json(savedEmployee);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Retrieve all employees
app.get('/getAllEmployees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Middleware to parse JSON bodies
app.use(express.json());

// Define the route handler for POST requests to '/getEmployee'
// Define the route handler for POST requests to '/getEmployee'
// Define the route handler for POST requests to '/getEmployee'
app.post('/getEmployee', async (req, res) => {
  try {
    const { employeeId, date, dateend } = req.body; // Access search criteria from request body
    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    // Adjust date range to filter works based on start date and end date inclusively
    if (date && dateend) {
      query.date = { $gte: new Date(date), $lte: new Date(dateend) };
    } else if (date) {
      query.date = { $gte: new Date(date) };
    } else if (dateend) {
      query.date = { $lte: new Date(dateend) };
    }
    

    const employees = await Employee.find(query);

    if (employees.length > 0) {
      res.status(200).json(employees);
    } else {
      res.status(404).json({ error: 'Employees not found for the given criteria' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update employee data by employeeId
// Update employee data by _id (auto-generated primary key)
app.put('/updateEmployee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updatedEmployeeData = req.body;

    // Find the employee by _id and update the data
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: employeeId }, // Use _id instead of employeeId
      updatedEmployeeData,
      { new: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Delete employee data by employeeId
// Update employee data by _id (auto-generated primary key)
app.delete('/deleteEmployee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the employee by _id and delete it
    const deletedEmployee = await Employee.findOneAndDelete({ _id: employeeId });

    if (!deletedEmployee) {
      // If no employee found, return a 404 status
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.use(bodyParser.json());
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
