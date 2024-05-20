import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "@/components/users/forgotPassword/ForgotPassword";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { mutationForgotPassword } from "@/graphql/Users";
import toast from "react-hot-toast";

// Mocks React-Hot-Toast
jest.mock("react-hot-toast");

const mocks: MockedResponse[] = [
  {
    request: {
      query: mutationForgotPassword,
      variables: { email: "test@example.com" },
    },
    result: {
      data: {
        resetPassword: true,
      },
    },
  },
  {
    request: {
      query: mutationForgotPassword,
      variables: { email: "nonexistent@example.com" },
    },
    result: {
      data: {
        resetPassword: true,
      },
    },
  },
];

const networkErrorMock: MockedResponse[] = [
  {
    request: {
      query: mutationForgotPassword,
      variables: { email: "test@example.com" },
    },
    error: new Error("Failed to fetch"),
  },
];

const renderComponent = (mockResponses = mocks) =>
  render(
    <MockedProvider mocks={mockResponses} addTypename={false}>
      <ForgotPassword />
    </MockedProvider>,
  );

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders correctly", () => {
    renderComponent();
    expect(screen.getByText(/Mot de passe oublié \?/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Nous allons vous envoyer un lien par email sur votre adresse pour réinitialiser votre mot de passe./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /réinitialiser mon mot de passe/i }),
    ).toBeDisabled();
  });

  it("enables the submit button when a valid email is entered", () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(
      screen.getByRole("button", { name: /réinitialiser mon mot de passe/i }),
    ).toBeEnabled();
  });

  it("displays success toast on successful password reset", async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", {
      name: /réinitialiser mon mot de passe/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        `Un email vous a été envoyé pour réinitialiser votre mot de passe`,
        { style: { background: "#4caf50", color: "white" } },
      );
    });
  });

  it("displays success toast even if email does not exist", async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, {
      target: { value: "nonexistent@example.com" },
    });

    const submitButton = screen.getByRole("button", {
      name: /réinitialiser mon mot de passe/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        `Un email vous a été envoyé pour réinitialiser votre mot de passe`,
        { style: { background: "#4caf50", color: "white" } },
      );
    });
  });

  it("displays error toast on network error", async () => {
    renderComponent(networkErrorMock);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", {
      name: /réinitialiser mon mot de passe/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Erreur de connexion, veuillez réessayer",
        {
          style: { background: "#f44336", color: "white" },
        },
      );
    });
  });
});
