
const connectButton = document.getElementById('connectButton');
const statusAccount = document.getElementById('status');
const account = document.getElementById('account');
const contractFunctionStoreButton = document.getElementById('contractFunctionStore');
const valueInput = document.getElementById('valueInput');
const contractFunctionRetrieveButton = document.getElementById('contractFunctionRetrieve');
const contractFunction = document.getElementById('contractStorageFunction');

async function connectMetaMask() {
	if (typeof window.ethereum !== 'undefined') {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log("Connected to MetaMask");

			// HTML elements
			statusAccount.innerText = "Connected";
			account.innerText = await signer.getAddress();
			contractFunctionStoreButton.hidden = false;
			contractFunctionRetrieveButton.hidden = false;
			valueInput.hidden = false;
			contractFunction.hidden = false;

			return signer;
		} catch (error) {
			statusAccount.innerText = "Access denied";
			console.error("User deniwed account access");
		}
	} else {
		console.error("MetaMask is not installed");
	}
}


const contractAddress = '0xA0ea80AeD980638699fC7c7fb2FEF5dCA78B4e46';
const contractABI = [
{
	"inputs": [
		{
			"internalType": "uint256",
			"name": "num",
			"type": "uint256"
		}
	],
	"name": "store",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"inputs": [],
	"name": "retrieve",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
	],
	"stateMutability": "view",
	"type": "function"
}
];;

async function contractFunctionStore() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	const value = document.getElementById('valueInput').value;

	if (value === '') {
		console.error("Value is empty");
		// display the button light red for 1 second
		contractFunctionStoreButton.style.backgroundColor = 'red';
		// change placeholder text to Value is empty+
		valueInput.placeholder = "VALUE IS EMPTY";
		setTimeout(() => {
			contractFunctionStoreButton.style.backgroundColor = '';
			valueInput.placeholder = "Value";
		}, 1000);
		return;
	}
	
	try {
		console.log("Storing value in contract");
		const spinner = document.getElementById('spinner');
		// add a spiner to the div with id spinner
		spinner.insertAdjacentHTML('afterbegin', '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
		const transactionResponse = await contract.store(value);
		await transactionResponse.wait();
		console.log("Transaction successful");
		// remove the spinner
		spinner.removeChild(spinner.firstChild);
	} catch (error) {
		console.error("Transaction failed", error);
	}
}

async function contractFunctionRetrieve() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	
	// retrieve value from contract
	try {
		const value = await contract.retrieve();
		document.getElementById('value').innerText = "Value: " + value.toString();
	} catch (error) {
		console.error("Call failed", error);
	}
}

connectButton.addEventListener('click', connectMetaMask);
contractFunctionStoreButton.addEventListener('click', contractFunctionStore);
contractFunctionRetrieveButton.addEventListener('click', contractFunctionRetrieve);

