const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts;
console.log(output);

fs.ensureDirSync(buildPath);

for (let contractName in output) {
	const contract = output[contractName];
	fs.outputJsonSync(
		path.resolve(buildPath, contractName.slice(1) + ".json"),
		contract
	);
}
