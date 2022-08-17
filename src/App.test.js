import { render, screen } from "@testing-library/react";
import mockFetch from "./mocks/mockFetch";
import App from "./App";

beforeEach(() => {
  jest.spyOn(window, "fetch").mockImplementation(mockFetch);
})

afterEach(() => {
  jest.restoreAllMocks()
})

test("renders the landing page", async () => {
  render(<App />);  //render the component into DOM

  /* test if the landing page renders accurately
     expect function paired with a matcher function
     React Testing Library provides the screen object provides queries that allow you to locate elements within the DOM
      getBy* (most commonly used)
      queryBy* (used when testing the absence of an element without throwing an error)
      findBy* (used when testing asynchronous code)
  */
  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");

  // findBy query verifies that the document contains an option with the value of husky. 
  // findBy queries are used when you need to test asynchronous code that is dependent on something being in the DOM after a period of time. 
  expect(await screen.findByRole("option", { name: "husky"})).toBeInTheDocument();
  
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  expect(screen.getByRole("img")).toBeInTheDocument();
});
