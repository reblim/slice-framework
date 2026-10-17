import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { QuickEstimate } from "@/components/calculator/QuickEstimate";
import { Toaster } from "@/components/ui/sonner";

beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
});

describe("Quick estimate example feedback", () => {
  it("shows a toast for the authentication example and Undo restores the empty form", async () => {
    render(
      <>
        <Toaster />
        <QuickEstimate onContinue={() => {}} />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Try example: authentication" }));

    expect(await screen.findByText("Example loaded: authentication")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Example loaded" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /About a day/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(screen.getByRole("radio", { name: /About a day/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(
      screen.getByText("Answer the questions above to see your estimate."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("quick-result")).not.toBeInTheDocument();
  });
});
