import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import UserName from "@/components/users/components/UserName";

type UserNameType = "firstName" | "lastName" | "nickName";

describe("UserName Component", () => {
  const mockSetUserName = jest.fn();

  // Test for each type: firstName, lastName, nickName
  const types = ["firstName", "lastName", "nickName"];
  types.forEach((type) => {
    describe(`when used for ${type}`, () => {
      it(`renders ${type} field correctly`, () => {
        render(
          <UserName
            userName=""
            setUserName={mockSetUserName}
            type={type as UserNameType}
          />,
        );
        const nameInput = screen.getByRole("textbox");
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveAttribute("type", "text");
      });

      it(`shows error for invalid ${type}`, () => {
        render(
          <UserName
            userName=""
            setUserName={mockSetUserName}
            type={type as UserNameType}
          />,
        );
        const nameInput = screen.getByRole("textbox");
        fireEvent.change(nameInput, { target: { value: "1" } });
        const helperText = screen.getByText(
          /Ne doit contenir que des lettres/i,
        );
        expect(helperText).toBeInTheDocument();
      });

      it(`accepts valid ${type}`, () => {
        render(
          <UserName
            userName=""
            setUserName={mockSetUserName}
            type={type as UserNameType}
          />,
        );
        const nameInput = screen.getByRole("textbox");
        fireEvent.change(nameInput, { target: { value: "Dupont" } });
        expect(mockSetUserName).toHaveBeenCalledWith("Dupont");
      });
    });
  });
});
