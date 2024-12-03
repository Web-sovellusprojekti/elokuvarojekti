import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LogoutButton } from './LogoutButton.js';

test('LogoutButton calls onLogout component on click', () => {
  const handleLogout = jest.fn();
  const { getByText } = render(<LogoutButton onLogout={handleLogout} />);
  const button = getByText('Logout');
  fireEvent.click(button);
  expect(handleLogout).toHaveBeenCalledTimes(1);
});

test('LogoutButton does not call onLogout if the onLogout prop is not provided', () => {
  const { getByText } = render(<LogoutButton />);
  const button = getByText('Logout');
  fireEvent.click(button);
  // no function is called because onLogout is undefined
  expect.assertions(0); 
});

