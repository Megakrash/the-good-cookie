import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ResetPassword from "@/components/users/resetPassword/ResetPassword";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { mutationSetPassword } from "@/graphql/Users";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast");

const mocks: MockedResponse[] = [
  {
    request: {
      query: mutationSetPassword,
      variables: { password: "NewPassword123!", token: "valid-token" },
    },
    result: {
      data: {
        setPassword: true,
      },
    },
  },
];

const networkErrorMock: MockedResponse[] = [
  {
    request: {
      query: mutationSetPassword,
      variables: { password: "NewPassword123!", token: "valid-token" },
    },
    error: new Error("Failed to fetch"),
  },
];

const invalidTokenMock: MockedResponse[] = [
  {
    request: {
      query: mutationSetPassword,
      variables: { password: "NewPassword123!", token: "invalid-token" },
    },
    error: new Error("invalid token"),
  },
];

const expiredTokenMock: MockedResponse[] = [
  {
    request: {
      query: mutationSetPassword,
      variables: { password: "NewPassword123!", token: "expired-token" },
    },
    error: new Error("expired token"),
  },
];

const renderComponent = (
  mockResponses = mocks,
  query = { token: "valid-token" },
) => {
  (useRouter as jest.Mock).mockReturnValue({ query });

  return render(
    <MockedProvider mocks={mockResponses} addTypename={false}>
      <ResetPassword />
    </MockedProvider>,
  );
};

describe("ResetPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    renderComponent();
    expect(
      screen.getByText(/Réinitialisation de votre mot de passe/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Veuillez renseigner votre nouveau mot de passe/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /envoyer/i })).toBeDisabled();
  });

  it("enables the submit button when passwords are valid and match", async () => {
    renderComponent();
    const passwordInputs = screen.getAllByLabelText(/mot de passe/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "NewPassword123!" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "NewPassword123!" },
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /envoyer/i })).toBeEnabled();
    });
  });

  it("displays success toast on successful password reset", async () => {
    renderComponent();
    const passwordInputs = screen.getAllByLabelText(/mot de passe/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.change(passwordInput, { target: { value: "NewPassword123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "NewPassword123!" },
    });

    const submitButton = screen.getByRole("button", { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Votre mot de passe a été réinitialisé avec succès",
        { style: { background: "#4caf50", color: "white" } },
      );
    });
  });

  it("displays error toast on network error", async () => {
    renderComponent(networkErrorMock);
    const passwordInputs = screen.getAllByLabelText(/mot de passe/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.change(passwordInput, { target: { value: "NewPassword123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "NewPassword123!" },
    });

    const submitButton = screen.getByRole("button", { name: /envoyer/i });
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

  it("displays error toast on invalid token", async () => {
    renderComponent(invalidTokenMock, { token: "invalid-token" });
    const passwordInputs = screen.getAllByLabelText(/mot de passe/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.change(passwordInput, { target: { value: "NewPassword123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "NewPassword123!" },
    });

    const submitButton = screen.getByRole("button", { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Votre lien de réinitialisation est invalide ou expiré, veuillez retenter de réinitialiser votre mot de passe",
        { style: { background: "#f44336", color: "white" } },
      );
    });
  });

  it("displays error toast on expired token", async () => {
    renderComponent(expiredTokenMock, { token: "expired-token" });
    const passwordInputs = screen.getAllByLabelText(/mot de passe/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.change(passwordInput, { target: { value: "NewPassword123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "NewPassword123!" },
    });

    const submitButton = screen.getByRole("button", { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "Votre lien de réinitialisation est invalide ou expiré, veuillez retenter de réinitialiser votre mot de passe",
        { style: { background: "#f44336", color: "white" } },
      );
    });
  });
});
