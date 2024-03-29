import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  blockchainConnect,
  getMintedTokens,
  getTotalTokens,
  getTokenPrice,
  getTokenPresalePrice,
  getMaxMintAmount,
  getPresaleMaxMintAmount,
  getInPresale,
  getEnabled,
  mintToken,
  getMintedTokensRO,
  getTotalTokensRO,
} from '../contract-gateway';

let App;

const ownerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const allowlistedAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

global.console = {
  ...console,
  error: jest.fn(),
};

const accountsChangedEvent = (addressList) => {
  fireEvent(
    document,
    new CustomEvent('accountsChanged', { detail: addressList }),
  );
};

const connectWallet = (address) => {
  window.ethereum.selectedAddress = address;
  accountsChangedEvent(address ? [address] : []);
};

const installMetamask = () => {
  window.ethereum = {
    isMetaMask: true,
    on: (eventName, handler) => {
      document.addEventListener(eventName, (event) => handler(event.detail));
    },
  };
};

const uninstallMetamask = () => {
  delete window.ethereum;
};

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

jest.mock('../contract-gateway');
jest.mock('../allowlist', () => [
  '0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0',
]);

beforeEach(() => {
  blockchainConnect.mockImplementation(async (callback) => {
    if (isMetaMaskInstalled()) {
      connectWallet(allowlistedAddress);
      await callback(allowlistedAddress);
    } else {
      throw Error('Please install MetaMask to interact with this page');
    }
  });

  getEnabled.mockImplementation(() => Promise.resolve(true));
  getMintedTokens.mockImplementation(() => Promise.resolve(2));
  getTotalTokens.mockImplementation(() => Promise.resolve(1500));
  getTokenPrice.mockImplementation(() => Promise.resolve('0.04'));
  getTokenPresalePrice.mockImplementation(() => Promise.resolve('0.03'));
  getMaxMintAmount.mockImplementation(() => Promise.resolve(10));
  getPresaleMaxMintAmount.mockImplementation(() => Promise.resolve(2));
  getInPresale.mockImplementation(() => Promise.resolve(true));
  mintToken.mockImplementation(() => Promise.resolve());
  getMintedTokensRO.mockImplementation(() => Promise.resolve(2));
  getTotalTokensRO.mockImplementation(() => Promise.resolve(1500));

  App = require('./App').default; // eslint-disable-line global-require

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

  test('load when wallet is already connected, account data still not available', () => {
    connectWallet(allowlistedAddress);

    render(<App />);

    expect(screen.getByText('Mint your Adovals!')).toBeInTheDocument();
    expect(
      screen.queryByText(`Wallet address: ${allowlistedAddress}`),
    ).toBeNull();
    expect(screen.getByText('Connect wallet')).toBeInTheDocument();
  });

  describe('read only data', () => {
    test('load read only data while not connected', async () => {
      render(<App />);

      expect(await screen.findByText('Adovals minted')).toBeInTheDocument();
      expect(screen.getByText('Connect wallet')).toBeInTheDocument();
    });

    test('read only data not available', () => {
      getMintedTokensRO.mockImplementation(() => Promise.reject(new Error()));

      render(<App />);

      expect(screen.queryByText('Adovals minted')).toBeNull();
      expect(screen.getByText('Connect wallet')).toBeInTheDocument();
    });
  });
});

describe('account management', () => {
  test('connect wallet account', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(await screen.findByText('Adovals minted')).toBeInTheDocument();
    expect(
      screen.getByText(`Wallet address: ${allowlistedAddress}`),
    ).toBeInTheDocument();
    expect(screen.queryByText('Connect wallet')).toBeNull();
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

    connectWallet(null);

    await screen.findByText('Connect wallet');
  });

  test('swap account while connected without data loaded', () => {
    connectWallet(allowlistedAddress);

    render(<App />);

    expect(
      screen.queryByText(`Wallet address: ${allowlistedAddress}`),
    ).toBeNull();

    connectWallet(ownerAddress);

    expect(
      screen.getByText(`Wallet address: ${ownerAddress}`),
    ).toBeInTheDocument();
  });

  test('swap account while connected and data is loaded', async () => {
    connectWallet(allowlistedAddress);

    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(
      screen.getByText(`Wallet address: ${allowlistedAddress}`),
    ).toBeInTheDocument();

    connectWallet(ownerAddress);

    expect(
      screen.getByText(`Wallet address: ${ownerAddress}`),
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

describe('wallet connected', () => {
  describe('presale', () => {
    beforeEach(async () => {
      getInPresale.mockImplementation(() => Promise.resolve(true));
      App = require('./App').default; // eslint-disable-line global-require
      render(<App />);
      await userEvent.click(screen.getByText('Connect wallet'));
    });

    test('contract data is displayed when in presale', async () => {
      expect(screen.getByText('2 / 1500')).toBeInTheDocument();
      expect(screen.getByText('0.03 ETH')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Mint' })).toBeInTheDocument();
      expect(
        screen.getByText('You can mint a max of 2 Adovals'),
      ).toBeInTheDocument();
    });

    test('plus button stops at presale max mint amount when in presale', async () => {
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);

      await userEvent.click(screen.getByTestId('increase-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(2);

      await userEvent.click(screen.getByTestId('increase-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(2);
    });

    test('minus button stops at 1 when in presale', async () => {
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);

      await userEvent.click(screen.getByTestId('increase-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(2);

      await userEvent.click(screen.getByTestId('decrease-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);

      await userEvent.click(screen.getByTestId('decrease-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);
    });
  });

  describe('public mint', () => {
    beforeEach(async () => {
      getInPresale.mockImplementation(() => Promise.resolve(false));
      App = require('./App').default; // eslint-disable-line global-require
      render(<App />);
      await userEvent.click(screen.getByText('Connect wallet'));
    });

    test('contract data is displayed when not in presale', async () => {
      expect(screen.getByText('2 / 1500')).toBeInTheDocument();
      expect(screen.getByText('0.04 ETH')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Mint' })).toBeInTheDocument();
      expect(
        screen.getByText('You can mint a max of 10 Adovals'),
      ).toBeInTheDocument();
    });

    test('plus button stops at max mint amount when not in presale', async () => {
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);

      for (let i = 1; i < 10; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(screen.getByTestId('increase-mint-button'));
      }
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(10);

      await userEvent.click(screen.getByTestId('increase-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(10);
    });

    test('minus button stops at 1 when not in presale', async () => {
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);

      await userEvent.click(screen.getByTestId('increase-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(2);

      await userEvent.click(screen.getByTestId('decrease-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);

      await userEvent.click(screen.getByTestId('decrease-mint-button'));
      expect(screen.getByTestId('mint-amount-number')).toHaveTextContent(1);
    });
  });
});

describe('mint', () => {
  test('transaction success', async () => {
    getInPresale.mockImplementation(() => Promise.resolve(true));
    App = require('./App').default; // eslint-disable-line global-require
    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(screen.getByText('2 / 1500')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Mint' }));

    expect(
      screen.getByText('Mint transaction sent successfully.'),
    ).toBeInTheDocument();
  });
});

describe('error handling', () => {
  test('error getting contract data', async () => {
    getMintedTokens.mockImplementation(() =>
      Promise.reject(new Error('Contract unreachable')),
    );
    App = require('./App').default; // eslint-disable-line global-require
    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    expect(
      screen.getByText(
        'Error communicating with the contract: Contract unreachable',
      ),
    ).toBeInTheDocument();
  });

  test('transaction error', async () => {
    mintToken.mockImplementation(() =>
      Promise.reject(new Error('Transaction error')),
    );
    App = require('./App').default; // eslint-disable-line global-require
    render(<App />);
    await userEvent.click(screen.getByText('Connect wallet'));

    await userEvent.click(screen.getByRole('button', { name: 'Mint' }));

    expect(
      screen.getByText('Unable to mint: Transaction error'),
    ).toBeInTheDocument();
  });
});
