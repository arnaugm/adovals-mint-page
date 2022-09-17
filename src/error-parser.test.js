import { parseError } from './error-parser';

const transactionError = {
  reason:
    "Error: VM Exception while processing transaction: reverted with reason string 'The total mint amount for the account is bigger than the maximum'",
  code: 'UNPREDICTABLE_GAS_LIMIT',
  method: 'estimateGas',
  transaction: {
    from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    value: {
      type: 'BigNumber',
      hex: '0x8e1bc9bf040000',
    },
    data: '0xba41b0c6000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000',
    accessList: null,
  },
  error: {
    code: -32603,
    message: 'Internal JSON-RPC error.',
    data: {
      code: -32603,
      message:
        "Error: VM Exception while processing transaction: reverted with reason string 'The total mint amount for the account is bigger than the maximum'",
    },
    stack:
      '{\n  "code": -32603,\n  "message": "Internal JSON-RPC error.",\n  "data": {\n    "code": -32603,\n    "message": "Error: VM Exception while processing transaction: reverted with reason string \'The total mint amount for the account is bigger than the maximum\'"\n  },\n  "stack": "Error: Internal JSON-RPC error.\\n    at new i (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:1:308657)\\n    at a (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:1:311413)\\n    at Object.internal (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:1:312023)\\n    at c (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-3.js:3:25295)\\n    at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-3.js:3:26327\\n    at async chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-5.js:19:40569"\n}\n  at new i (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:1:308657)\n  at a (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:1:311413)\n  at Object.internal (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:1:312023)\n  at c (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-3.js:3:25295)\n  at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-3.js:3:26327\n  at async chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-5.js:19:40569',
  },
};

const unknownError = {
  code: 'UNPREDICTABLE_GAS_LIMIT',
  method: 'estimateGas',
};

const reasonMessageError = {
  reason: 'error reason',
  message: 'error message',
};

describe('error-parser', () => {
  it('should return a readable error message', () => {
    const expectedError =
      "Error: VM Exception while processing transaction: reverted with reason string 'The total mint amount for the account is bigger than the maximum'";
    const parsedError = parseError(transactionError);

    expect(parsedError).toEqual(expectedError);
  });

  it('should return a the message of a javascript Error object', () => {
    const expectedError = 'Error object message';
    const parsedError = parseError(new Error('Error object message'));

    expect(parsedError).toEqual(expectedError);
  });

  it('should return the reason if both reason and message are provided', () => {
    const expectedError = reasonMessageError.reason;
    const parsedError = parseError(reasonMessageError);

    expect(parsedError).toEqual(expectedError);
  });

  it('should return the whole error if the expected message fields are not present', () => {
    const expectedError =
      '{"code":"UNPREDICTABLE_GAS_LIMIT","method":"estimateGas"}';
    const parsedError = parseError(unknownError);

    expect(parsedError).toBe(expectedError);
  });

  it('should return a string if the error is a string', () => {
    const expectedError = 'error';
    const parsedError = parseError('error');

    expect(parsedError).toEqual(expectedError);
  });
});
