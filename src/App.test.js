import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
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

test("should be able to search and display dog image results", async () => {
  render(<App />);

  /* Simulate selecting an option and verifying its value */
  const select = screen.getByRole("combobox");

  //wait for the cattledog option to appear in the document
  expect(await screen.findByRole("option", { name: "cattledog"})).toBeInTheDocument();

  // userEvent object simulates common user interactions
  // selectOptions method selects the cattledog option that you waited for on the previous line
  userEvent.selectOptions(select, "cattledog");

  // asserts that the select variable contains the cattledog value selected above.
  expect(select).toHaveValue("cattledog");

  /* Simulate initiating the search request */

  // getByRole query locates the search button
  const searchBtn = screen.getByRole("button", { name: "Search" });

  // toBeDisabled jest-dom matcher will verify that the search button is not disabled when a breed selection is made.
  expect(searchBtn).not.toBeDisabled();
  userEvent.click(searchBtn);

  // Loading state displays and gets removed once results are displayed
  // waitForElementToBeRemoved async helper function wait for the appearance and disappearance of the Loading message.
  // queryByText within the waitForElementToBeRemoved callback checks for the absence of an element without throwing an error.
  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

  /* Verify image display and results count */

  // select all the dog images and assign them to the dogImages variable. 
  // The *AllBy* variant of the query returns an array containing multiple elements that match the specified role
  const dogImages = screen.getAllByRole("img");

  // The mocked fetch implementation contained two image URLs within the response. 
  // With Jest???s toHaveLength matcher, you can verify that there are two images displayed.
  expect(dogImages).toHaveLength(2);

  // The getByText query will check that the proper results count appears in the right-hand corner.
  expect(screen.getByText(/2 Results/i)).toBeInTheDocument();

  // toHaveAccessibleName matchers verify that the appropriate alt text is associated with individual images.
  expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2");
  expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");
})
