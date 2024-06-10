import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
// ATATT3xFfGF0KBuhAhAbr3g2j7oEI5ju2HevaK88j7BX4UFdP8bB7ry_umB2yRHB3_hTFntHLkLn1mABnTA46lT00w9MbaOKd4Tx9Zvqd7nxb-UE-dGWd8sZxDzdXH68jlfe0Uto5ede-NjZDRFWxPlzn2bK43f-_RY_nV9jOQQ0R20yPipYgGw=E17F6E7A