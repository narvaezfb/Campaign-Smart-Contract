import web3 from "./web3";
import campaign from "./build/Campaign.json";

export default (campaignAddress) => {
	try {
		return new web3.eth.Contract(
			JSON.parse(campaign.interface),
			campaignAddress
		);
	} catch (error) {
		console.error("Error parsing campaignFactory as JSON:", error);
	}
};
