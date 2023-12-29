import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { Button, Checkbox, Form, Message } from "semantic-ui-react";
import factory from "./../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const NewCampaign = () => {
	const [minimunContribution, setMinimunContribution] = useState(0);
	const [errorMessages, setErrorMessages] = useState([]);
	const [isInvalidTransaction, setIsInvalidTransaction] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function createCampaign(event) {
		setIsLoading(true);
		try {
			event.preventDefault();
			if (isValid) {
				const accounts = await web3.eth.getAccounts();
				await factory.methods
					.createCampaign(minimunContribution)
					.send({ from: accounts[0] });
				setMinimunContribution(0);
				Router.push("/");
			} else {
				const newErrorMessage =
					"Minimun contribution must be a positive numeric value";
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
		setMinimunContribution(event.target.value);
		const isNumeric = /^[0-9]*$/.test(minimunContribution);
		if (isNumeric && parseFloat(minimunContribution) > 0) {
			setIsValid(true);
		}
		cleanErrors();
	}

	function cleanErrors() {
		setErrorMessages([]);
		setIsInvalidTransaction(false);
	}

	return (
		<Layout>
			<div>
				<h3>Create a Campaign</h3>
				<Form onSubmit={createCampaign} error={isInvalidTransaction}>
					<Form.Field width={4}>
						<label>Minimun Contribution (wei)</label>
						<input
							placeholder="$"
							value={minimunContribution}
							onChange={handleChange}
						/>
					</Form.Field>
					<Button loading={isLoading} primary>
						Create
					</Button>
					<Message error header="Oops!" list={errorMessages} />
				</Form>
			</div>
		</Layout>
	);
};

export default NewCampaign;
