const assert = require("assert");
const { Web3 } = require("web3");
const ganache = require("ganache");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("./../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("./../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: "1000000" });

	await factory.methods
		.createCampaign("100")
		.send({ from: accounts[0], gas: "1000000" });

	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe("Campaigns", () => {
	it("deploys a factory and a campaign", () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it("marks caller as the campaign manager", async () => {
		const creatorAddress = accounts[0];
		const manager = await campaign.methods.manager().call();
		assert.equal(creatorAddress, manager);
	});

	it("contribute money to campaign ", async () => {
		const sender = accounts[1];
		await campaign.methods.contribute().send({ from: sender, value: "200" });
		const approverAddress = await campaign.methods.approvers(sender).call();
		console.log(approverAddress);
		assert.ok(approverAddress);
	});

	it("requires minimun contribution", async () => {
		try {
			await campaign.methods
				.contribute()
				.send({ from: accounts[2], value: "50" });
			assert(false);
		} catch (error) {
			assert(error);
		}
	});

	it("allows manager to make a payment request", async () => {
		// request information
		const description = "New Request";
		const value = 100;
		const recipient = accounts[3];
		const manager = accounts[0];

		// manager creates a new request
		await campaign.methods
			.createRequest(description, value, recipient)
			.send({ from: manager, gas: "1000000" });

		const request = await campaign.methods.requests(0).call();

		assert.equal(request.description, description);
	});

	it("processes requests", async () => {
		// request information
		const description = "New Request";
		const value = 100;
		const recipient = accounts[3];
		const manager = accounts[0];

		// make two contributions
		for (var index = 1; index < 3; index++) {
			await campaign.methods
				.contribute()
				.send({ from: accounts[index], value: "200" });
		}
		// manager creates a new request
		await campaign.methods
			.createRequest(description, value, recipient)
			.send({ from: manager, gas: "1000000" });

		// approve the request
		for (var index = 1; index < 3; index++) {
			await campaign.methods
				.approveRequest(0)
				.send({ from: accounts[index], gas: "1000000" });
		}

		// finalize request
		await campaign.methods
			.finalizeRequest(0)
			.send({ from: manager, gas: "1000000" });

		// verify request approval
		const request = await campaign.methods.requests(0).call();
		console.log(request);
		assert.equal(request.complete, true);
	});
});
