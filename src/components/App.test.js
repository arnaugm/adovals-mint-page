import { render, screen } from '@testing-library/react';
import App from './App';

test.skip('renders the non connected page', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test.todo('Metamask is not installed');
test.todo('Metamask is installed');
test.todo('install Metamask while page loaded');
test.todo('uninstall Metamask while page loaded');
test.todo('connect');
test.todo('load when already connected');
test.todo('disconnect');
test.todo('swap accountd');
test.todo('mint presale in whitelist');
test.todo('mint in presale not in whitelist');
test.todo('mint presale owner');
test.todo('mint public');
test.todo('mint públic owner');
test.todo('transaction error');
test.todo('transaction success');
