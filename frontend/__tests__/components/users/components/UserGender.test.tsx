import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserGender from "@/components/users/components/UserGender";

describe("UserGender", () => {
  const setGenderMock = jest.fn();

  it("renders three gender options", () => {
    render(<UserGender gender="" setGender={setGenderMock} />);
    expect(screen.getByLabelText("Monsieur")).toBeInTheDocument();
    expect(screen.getByLabelText("Madame")).toBeInTheDocument();
    expect(screen.getByLabelText("Autre")).toBeInTheDocument();
  });

  it("marks the Monsieur button as checked when gender is set to Monsieur", () => {
    render(<UserGender gender="MAN" setGender={setGenderMock} />);
    expect(screen.getByLabelText("Monsieur")).toBeChecked();
    expect(screen.getByLabelText("Madame")).not.toBeChecked();
    expect(screen.getByLabelText("Autre")).not.toBeChecked();
  });

  it("marks the Madame button as checked when gender is set to Madame", () => {
    render(<UserGender gender="WOMAN" setGender={setGenderMock} />);
    expect(screen.getByLabelText("Monsieur")).not.toBeChecked();
    expect(screen.getByLabelText("Madame")).toBeChecked();
    expect(screen.getByLabelText("Autre")).not.toBeChecked();
  });

  it("calls setGender when a gender is selected", () => {
    render(<UserGender gender="" setGender={setGenderMock} />);
    fireEvent.click(screen.getByLabelText("Monsieur"));
    expect(setGenderMock).toHaveBeenCalledWith("MAN");
  });

  it("marks the Autre button as checked when gender is set to Autre", () => {
    render(<UserGender gender="OTHER" setGender={setGenderMock} />);
    expect(screen.getByLabelText("Monsieur")).not.toBeChecked();
    expect(screen.getByLabelText("Madame")).not.toBeChecked();
    expect(screen.getByLabelText("Autre")).toBeChecked();
  });
});
