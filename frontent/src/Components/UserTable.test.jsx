import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Usertable from "./Usertable";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(axios);

describe("Usertable Component", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it("renders the component and displays the heading", () => {
    render(<Usertable />);
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
  });

  it("fetches and displays users", async () => {
    mockAxios.onGet("http://localhost:3000/api/users").reply(200, [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        dob: "2000-01-01",
      },
    ]);

    render(<Usertable />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("1/1/2000")).toBeInTheDocument();
  });

  it("opens and closes the create modal", async () => {
    render(<Usertable />);
    fireEvent.click(screen.getByText(/Add New User/i));

    expect(await screen.findByText(/Create User/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Cancel/i));

    await waitFor(() => {
      expect(screen.queryByText(/Create User/i)).not.toBeInTheDocument();
    });
  });

  // it("creates a new user", async () => {
  //   mockAxios.onPost("http://localhost:3000/api/users").reply(201);

  //   render(<Usertable />);
  //   fireEvent.click(screen.getByText(/Add New User/i));

  //   fireEvent.change(screen.getByLabelText(/Name/i), {
  //     target: { value: "Jane Doe" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Email/i), {
  //     target: { value: "jane@example.com" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
  //     target: { value: "1995-05-15" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Password/i), {
  //     target: { value: "password123" },
  //   });

  //   fireEvent.click(screen.getByText(/Create/i));

  //   await waitFor(() => {
  //     expect(mockAxios.history.post.length).toBe(1);
  //   });
  // });

  it("opens and pre-fills the update modal", async () => {
    const user = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      dob: "2000-01-01",
    };
    mockAxios.onGet("http://localhost:3000/api/users").reply(200, [user]);

    render(<Usertable />);

    // Wait for the "Update" button to appear
    await waitFor(() =>
      expect(screen.getByText(/Update/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/Update/i));

    expect(await screen.findByDisplayValue(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/john@example.com/i)).toBeInTheDocument();
  });

  // it("updates a user", async () => {
  //   mockAxios.onPut("http://localhost:3000/api/users/1").reply(200);
  //   const user = {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     dob: "2000-01-01",
  //   };

  //   render(<Usertable />);
  //   await waitFor(() =>
  //     expect(screen.getByText(/Update/i)).toBeInTheDocument()
  //   );
  //   fireEvent.click(screen.getByText(/Update/i));

  //   fireEvent.change(screen.getByLabelText(/Name/i), {
  //     target: { value: "John Updated" },
  //   });
  //   fireEvent.click(screen.getByText(/Update/i));

  //   await waitFor(() => {
  //     expect(mockAxios.history.put.length).toBe(1);
  //     expect(mockAxios.history.put[0].data).toContain("John Updated");
  //   });
  // });

  it("deletes a user", async () => {
    mockAxios.onGet("http://localhost:3000/api/users").reply(200, [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        dob: "2000-01-01",
      },
    ]);
    mockAxios.onDelete("http://localhost:3000/api/users/1").reply(200);

    render(<Usertable />);
    await screen.findByText("John Doe");

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(mockAxios.history.delete.length).toBe(1);
    });
  });
});
