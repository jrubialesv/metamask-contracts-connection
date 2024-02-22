# Project Readme

This project is a web application that interacts with the MetaMask wallet and a smart contract deployed on the Ethereum blockchain. It allows users to store and retrieve values in the smart contract.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open your web browser and navigate to `http://localhost:3000`

## Prerequisites

To use this application, you need to have MetaMask installed in your web browser and an Ethereum account.

## Usage

1. Click the "Connect" button to connect MetaMask to the application.
2. Once connected, your account address will be displayed.
3. Enter a value in the input field and click the "Store" button to store the value in the smart contract.
4. Click the "Retrieve" button to retrieve the stored value from the smart contract.

## Smart Contract

The smart contract used in this application has the following functions:

- `store(uint256 num)`: Stores a value in the contract.
- `retrieve() returns (uint256)`: Retrieves the stored value from the contract.

The contract address and ABI are defined in the `main.js` file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
