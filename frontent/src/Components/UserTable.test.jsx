import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserTable from "../Components/Usertable"; // Assuming UserTable is in the same directory
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Create a mock instance of axios
const mockAxios = new MockAdapter(axios);

describe("UserTable", () => {
  const usersData = [
    { id: 1, name: "John Doe", email: "john@example.com", dob: "1990-01-01" },
    { id: 2, name: "Jane Doe", email: "jane@example.com", dob: "1992-05-03" },
  ];

  beforeEach(() => {
    // Mock GET request to fetch users
    mockAxios.onGet("http://localhost:3000/api/users").reply(200, usersData);
  });

  afterEach(() => {
    mockAxios.reset(); // Reset after each test
  });

  test("renders the user table with fetched users", async () => {
    render(<UserTable />);

    // Ensure the users are displayed in the table
    await waitFor(() => screen.getByText("John Doe")); // Wait for user to load
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("1990-01-01")).toBeInTheDocument();
    expect(screen.getByText("1992-05-03")).toBeInTheDocument();
  });

  test("handles user deletion", async () => {
    mockAxios.onDelete("http://localhost:3000/api/users/1").reply(200); // Mock DELETE request

    render(<UserTable />);

    // Wait for users to load
    await waitFor(() => screen.getByText("John Doe"));

    // Click delete button for John Doe
    fireEvent.click(screen.getAllByText("Delete")[0]);

    // Verify if the user is deleted from the table
    await waitFor(() => {
      // Expect John Doe to no longer be in the document
      expect(screen.queryByText("John Doe")).toBeNull();
    });
  });

  // Additional test cases for updating and creating users
  test("opens the create user modal when the button is clicked", () => {
    render(<UserTable />);

    // Click the "Add New User" button to open the create user modal
    fireEvent.click(screen.getByText("Add New User"));

    // Check if the modal is opened
    expect(screen.getByText("Create User")).toBeInTheDocument();
  });

  test("handles user creation", async () => {
    const newUser = {
      name: "New User",
      email: "newuser@example.com",
      dob: "1995-12-12",
      password: "password123",
    };

    mockAxios.onPost("http://localhost:3000/api/users").reply(201, newUser); // Mock POST request

    render(<UserTable />);

    fireEvent.click(screen.getByText("Add New User")); // Open create modal

    // Fill the form and submit
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: newUser.name },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: newUser.email },
    });
    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: newUser.dob },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: newUser.password },
    });

    fireEvent.click(screen.getByText("Create")); // Submit the form

    // Verify if the API call is made
    await waitFor(() => screen.getByText("New User")); // Check if the new user appears in the table
    expect(screen.getByText(newUser.name)).toBeInTheDocument();
    expect(screen.getByText(newUser.email)).toBeInTheDocument();
  });

  test("handles user update", async () => {
    const updatedUser = {
      id: 1,
      name: "Updated Name",
      email: "updated@example.com",
      dob: "1990-01-01",
      password: "newpassword",
    };

    mockAxios
      .onPut(`http://localhost:3000/api/users/${updatedUser.id}`)
      .reply(200, updatedUser); // Mock PUT request

    render(<UserTable />);

    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByText("Update")[0]); // Click update button for John Doe

    // Fill the form with new data
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: updatedUser.name },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: updatedUser.email },
    });

    fireEvent.click(screen.getByText("Update")); // Submit the update form

    // Verify if the user is updated in the table
    await waitFor(() => screen.getByText(updatedUser.name));
    expect(screen.getByText(updatedUser.name)).toBeInTheDocument();
    expect(screen.getByText(updatedUser.email)).toBeInTheDocument();
  });
});
