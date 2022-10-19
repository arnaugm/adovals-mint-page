import { render, screen } from '@testing-library/react';

import MintControls from './MintControls';

const allowlistedAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';
const notAllowlistedAddress = '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f';
const maxMintAmount = 10;
const presaleMaxMintAmount = 2;
const price = '0.04';
const presalePrice = '0.03';
const onSuccess = () => {};
const onError = () => {};

jest.mock('../../allowlist', () => [
  '0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0',
]);

describe('Mint controls', () => {
  test('public mint allowlisted displays mint controls', () => {
    render(
      <MintControls
        account={allowlistedAddress}
        presale={false}
        maxMintAmount={maxMintAmount}
        price={price}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    expect(screen.getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });

  test('public mint not allowlisted displays mint controls', () => {
    render(
      <MintControls
        account={notAllowlistedAddress}
        presale={false}
        maxMintAmount={maxMintAmount}
        price={price}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    expect(screen.getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });

  test('presale allowlisted displays mint controls', () => {
    render(
      <MintControls
        account={allowlistedAddress}
        presale={true}
        maxMintAmount={presaleMaxMintAmount}
        price={presalePrice}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    expect(screen.getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });

  test('presale not allowlisted displays mint not available warning', () => {
    render(
      <MintControls
        account={notAllowlistedAddress}
        presale={true}
        maxMintAmount={presaleMaxMintAmount}
        price={presalePrice}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    expect(
      screen.getByText('Your address is not in the presale whitelist.', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});
