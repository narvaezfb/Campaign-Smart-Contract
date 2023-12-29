import React, { useState } from "react";
import { Button, Checkbox, Form, Message } from "semantic-ui-react";
import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = ({ address }) => {
	const [contributionAmount, setContributionAmount] = useState("");
	const [errorMessages, setErrorMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isInvalidTransaction, setIsInvalidTransaction] = useState(false);
	const [isValid, setIsValid] = useState(false);

	async function contributeToCampaign(event) {
		setIsLoading(true);
		try {
			event.preventDefault();
			if (isValid) {
				const campaign = getCampaign(address);
				const accounts = await web3.eth.getAccounts();
				await campaign.methods.contribute().send({
					from: accounts[0],
					value: web3.utils.toWei(contributionAmount, "ether"),
				});
				setContributionAmount(0);
				Router.replaceRoute(`/campaigns/${address}`);
			} else {
				const newErrorMessage = "contribution must be a positive numeric value";
				setErrorMessages([...errorMessages, newErrorMessage]);
				setIsInvalidTransaction(true);
			}
		} catch (err) {
			setErrorMessages([...errorMessages, err.message]);
			setIsInvalidTransaction(true);
		}
		setIsLoading(false);
	}

	function handleChange(event) {
		setContributionAmount(event.target.value);
		console.log(contributionAmount);
		const isNumeric = /^[0-9]*$/.test(contributionAmount);
		if (isNumeric) {
			setIsValid(true);
		}
		cleanErrors();
	}

	function cleanErrors() {
		setErrorMessages([]);
		setIsInvalidTransaction(false);
	}
	return (
		<div>
			<Form onSubmit={contributeToCampaign} error={isInvalidTransaction}>
				<Form.Field>
					<label>Contribute to this campaign</label>
					<input
						placeholder="$"
						value={contributionAmount}
						onChange={handleChange}
					/>
				</Form.Field>
				<Button loading={isLoading} primary>
					Contribute!
				</Button>
				<Message error header="Oops!" list={errorMessages} />
			</Form>
		</div>
	);
};

export default ContributeForm;
