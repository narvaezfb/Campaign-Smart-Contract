import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

let instance;

try {
	instance = new web3.eth.Contract(
		JSON.parse(campaignFactory.interface),
		"0x82680e369ff2cfaA16678da54DD3eaa145cf4063"
	);
	// Rest of your code...
} catch (error) {
	console.error("Error parsing campaignFactory as JSON:", error);
}

export default instance;
