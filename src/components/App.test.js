import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

const ownerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const allowlistedAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

const connectWallet = (address) => {
  window.ethereum.selectedAddress = address;
};

const accountsChangedEvent = (addressList) => {
  fireEvent(
    document,
    new CustomEvent('accountsChanged', { detail: addressList }),
  );
};

const installMetamask = () => {
  window.ethereum = {
    on: (eventName, handler) => {
      document.addEventListener(eventName, (event) => handler(event.detail));
    },
  };
};

const uninstallMetamask = () => {
  delete window.ethereum;
};

const isMetamaskInstalled = () => typeof window.ethereum !== 'undefined';

jest.mock('../contract-gateway', () => ({
  blockchainConnect: async (callback) => {
    if (isMetamaskInstalled()) {
      connectWallet(ownerAddress);
      accountsChangedEvent([ownerAddress]);
      await callback(true);
    } else {
      throw Error('Please install MetaMask to interact with this page');
    }
  },
  getEnabled: () => true,
  getMintedTokens: () => 2,
  getTotalTokens: () => 1500,
  getTokenPrice: () => '0.04 ETH',
  getTokenPresalePrice: () => '0.03 ETH',
  getMaxMintAmount: () => 10,
  getPresaleMaxMintAmount: () => 2,
  getInPresale: () => true,
}));

beforeEach(() => {
  installMetamask();
});

describe('page load', () => {
  test('Metamask is not installed', () => {
    uninstallMetamask();

    render(<App />);

    expect(screen.getByText('Mint your Adovals!')).toBeInTheDocument();
    expect(screen.queryByText('Wallet address:')).toBeNull();
    expect(screen.getByText('Connect wallet')).toBeInTheDocument();
  });

  test('Metamask is installed', () => {
    render(<App />);

    expect(screen.getByText('Mint your Adovals!')).toBeInTheDocument();
    expect(screen.getByText('Wallet address:')).toBeInTheDocument();
    expect(screen.getByText('Connect wallet')).toBeInTheDocument();
  });

  test('load when wallet is already connected', () => {
    connectWallet(ownerAddress);

    render(<App />);

    expect(screen.getByText('Mint your Adovals!')).toBeInTheDocument();
    expect(
      screen.getByText(`Wallet address: ${ownerAddress}`),
    ).toBeInTheDocument();
    expect(screen.getByText('Connect wallet')).toBeInTheDocument();
  });
});

describe('account management', () => {
  test('connect wallet account', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(
      screen.getByText(`Wallet address: ${ownerAddress}`),
    ).toBeInTheDocument();
    expect(screen.queryByText('Connect wallet')).toBeNull();
    expect(screen.getByText('Adovals minted')).toBeInTheDocument();
  });

  test('connect wallet account without metamask installed', async () => {
    uninstallMetamask();

    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(
      screen.getByText('Please install MetaMask to interact with this page'),
    ).toBeInTheDocument();
  });

  test('disconnect wallet account', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(screen.getByText('Adovals minted')).toBeInTheDocument();

    accountsChangedEvent([]);

    await screen.findByText('Connect wallet');
  });

  test('swap account while connected without data loaded', () => {
    connectWallet(ownerAddress);

    render(<App />);

    expect(
      screen.getByText(`Wallet address: ${ownerAddress}`),
    ).toBeInTheDocument();

    accountsChangedEvent([allowlistedAddress]);

    expect(
      screen.getByText(`Wallet address: ${allowlistedAddress}`),
    ).toBeInTheDocument();
  });

  test('swap account while connected and data is loaded', async () => {
    connectWallet(ownerAddress);

    render(<App />);

    await userEvent.click(screen.getByText('Connect wallet'));

    expect(
      screen.getByText(`Wallet address: ${ownerAddress}`),
    ).toBeInTheDocument();

    accountsChangedEvent([allowlistedAddress]);

    expect(
      screen.getByText(`Wallet address: ${allowlistedAddress}`),
    ).toBeInTheDocument();
  });

  test('install Metamask while page loaded', () => {
    uninstallMetamask();

    render(<App />);

    expect(screen.getByText('Mint your Adovals!')).toBeInTheDocument();
    expect(screen.getByText('Connect wallet')).toBeInTheDocument();

    installMetamask();

    expect(screen.getByText('Mint your Adovals!')).toBeInTheDocument();
    expect(screen.getByText('Connect wallet')).toBeInTheDocument();
  });
});

describe('mint', () => {
  test('mint presale in allowlist', () => {
    throw Error('pending');
  });

  test('mint in presale not in allowlist', () => {
    throw Error('pending');
  });

  test('mint presale owner', () => {
    throw Error('pending');
  });

  test('mint public', () => {
    throw Error('pending');
  });

  test('mint públic owner', () => {
    throw Error('pending');
  });

  test('transaction error', () => {
    throw Error('pending');
  });

  test('transaction success', () => {
    throw Error('pending');
  });
});
