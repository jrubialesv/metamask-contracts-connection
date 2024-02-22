
const connectButton = document.getElementById('connectButton');
const statusAccount = document.getElementById('status');
const account = document.getElementById('account');
const contractFunctionRestockButton = document.getElementById('contractFunctionRestock');
const valueInputRestock = document.getElementById('valueInputRestock');
const valueInputMultiplePurchase = document.getElementById('valueInputMultiplePurchase');
const valueInputAddress = document.getElementById('valueInputAddress');

const spinner = document.getElementById('spinner');

const contractFunctionPurchaseButton = document.getElementById('contractFunctionPurchase');
const contractFunctionMultiplePurchaseButton = document.getElementById('contractFunctionMultiplePurchase');
const contractFunctionRetrieveOwnerButton = document.getElementById('contractFunctionRetrieveOwner');
const contractFunctionRetrieveOwnerPurchasedButton = document.getElementById('contractFunctionRetrieveOwnerPurchased');
const contractFunction = document.getElementById('contractVendingFunction');

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
			contractFunctionRestockButton.hidden = false;
			contractFunctionPurchaseButton.hidden = false;
			contractFunctionMultiplePurchaseButton.hidden = false;
			contractFunctionRetrieveOwnerButton.hidden = false;
			contractFunctionRetrieveOwnerPurchasedButton.hidden = false;
			valueInputAddress.hidden = false;
			valueInputMultiplePurchase.hidden = false;
			valueInputRestock.hidden = false;
			contractFunction.hidden = false;
			

			return signer;
		} catch (error) {
			statusAccount.innerText = "Access denied" + error;
			console.error("User deniwed account access");
		}
	} else {
		console.error("MetaMask is not installed");
	}
}


const contractAddress = '0x16f2bd8710909c953dE56e217EF4CF5EF4949b00';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "multiplePurchase",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "purchase",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "restock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "bottlesInStock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "purchased",
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
];

async function contractFunctionRestock() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	const value = document.getElementById('valueInputRestock').value;

	if (value === '') {
		console.error("Value is empty");
		// display the button light red for 1 second
		contractFunctionRestockButton.style.backgroundColor = 'red';
		// change placeholder text to Value is empty+
		valueInputRestock.placeholder = "VALUE IS EMPTY";
		setTimeout(() => {
			contractFunctionRestockButton.style.backgroundColor = '';
			valueInputRestock.placeholder = "Value";
		}, 1000);
		return;
	}
	
	try {
		console.log("Storing value in contract");
		// add a spiner to the div with id spinner
		spinner.insertAdjacentHTML('afterbegin', '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
		const transactionResponse = await contract.restock(value);
		await transactionResponse.wait();
		
		alert("Restock successful");
		// remove the spinner
		spinner.removeChild(spinner.firstChild);
	} catch (error) {
		console.error("Transaction failed", error);
	}
}

async function contractFunctionPurchase() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	
	// retrieve value from contract
	try {
		spinner.insertAdjacentHTML('afterbegin', '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
		await contract.purchase({value: ethers.utils.parseEther("0.1")});

		// provide notification to user html
		alert("Purchase successful");
		// remove the spinner
		spinner.removeChild(spinner.firstChild);
	} catch (error) {
		console.error("Call failed", error);
	}
}

async function contractFunctionMultiplePurchase() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	const amount = document.getElementById('valueInputMultiplePurchase').value;

	if (amount === '') {
		console.error("Value is empty");
		// display the button light red for 1 second
		contractFunctionMultiplePurchaseButton.style.backgroundColor = 'red';
		// change placeholder text to Value is empty+
		amount.placeholder = "VALUE IS EMPTY";
		setTimeout(() => {
			contractFunctionMultiplePurchaseButton.style.backgroundColor = '';
			amount.placeholder = "Value";
		}, 1000);
		return;
	}
	
	// retrieve value from contract
	try {
		spinner.insertAdjacentHTML('afterbegin', '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
		const price = amount * 0.1;
		await contract.multiplePurchase(amount, {value: ethers.utils.parseEther(price.toString())});
		
		alert("Purchase successful");

		// remove the spinner
		spinner.removeChild(spinner.firstChild);
	} catch (error) {
		console.error("Call failed", error);
	}
}

async function contractFunctionRetrieveOwner() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);

	// retrieve value from contract
	try {
		const owner = await contract.owner();
		document.getElementById('owner').innerText = "Owner: " + owner.toString();
	} catch (error) {
		console.error("Call failed", error);
	}
}

async function contractFunctionRetrieveOwnerPurchased() {
	const signer = await connectMetaMask();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	const address = document.getElementById('valueInputAddress').value;

	if (address === '') {
		console.error("Value is empty");
		// display the button light red for 1 second
		contractFunctionRetrieveOwnerPurchasedButton.style.backgroundColor = 'red';
		// change placeholder text to Value is empty+
		address.placeholder = "VALUE IS EMPTY";
		setTimeout(() => {
			contractFunctionRetrieveOwnerPurchasedButton.style.backgroundColor = '';
			address.placeholder = "Value";
		}, 1000);
		return;
	}

	// retrieve value from contract
	try {
		const purchased = await contract.purchased(address);
		document.getElementById('purchased').innerText = "Purchased: " + purchased.toString();
	} catch (error) {
		console.error("Call failed", error);
	}
}




connectButton.addEventListener('click', connectMetaMask);
contractFunctionRestockButton.addEventListener('click', contractFunctionRestock);
contractFunctionPurchaseButton.addEventListener('click', contractFunctionPurchase);
contractFunctionMultiplePurchaseButton.addEventListener('click', contractFunctionMultiplePurchase);
contractFunctionRetrieveOwnerButton.addEventListener('click', contractFunctionRetrieveOwner);
contractFunctionRetrieveOwnerPurchasedButton.addEventListener('click', contractFunctionRetrieveOwnerPurchased);

