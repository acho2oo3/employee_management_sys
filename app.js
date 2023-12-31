const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');  // Import the 'path' module

const app = express();
const PORT = process.env.PORT || 3000;
const uri = "mongodb+srv://ciber:ciber123@cluster0.6sf1nhg.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri);
// Connect to MongoDB
// mongoose.connect('mongodb://localhost/employee_tracking', { useNewUrlParser: true, useUnifiedTopology: true });

// Create Employee schema and model
const employeeSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  workDescription: String,
  location: String,
  vehicleNumber: String,
  date: String
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
    const { name, employeeId, workDescription, location, vehicleNumber, date } = req.body;

    // Create a new employee instance
    const newEmployee = new Employee({
      name,
      employeeId,
      workDescription,
      location,
      vehicleNumber,
      date
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

// Retrieve employee data by employeeId
app.get('/getEmployee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employees = await Employee.find({ employeeId });

    if (employees.length > 0) {
      res.status(200).json(employees);
    } else {
      res.status(404).json({ error: 'Employees not found for the given ID' });
    }
  } catch (err) {
    res.status(500).send(err.message);
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
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
