import React, { useState } from "react";
import Layout from "../../../components/layout";
import { Button, Grid, Form, Message } from "semantic-ui-react";
import getCampaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Router } from "../../../routes";
import Web3 from "web3";

const NewRequest = ({ campaign }) => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [recipientAddress, setRecipientAddress] = useState("");
	const [errorMessages, setErrorMessages] = useState([]);
	const [isInvalidTransaction, setIsInvalidTransaction] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const createNewRequest = async () => {
		setIsLoading(true);
		try {
			if (isValid) {
				const accounts = await web3.eth.getAccounts();
				await campaign.methods
					.createRequest(
						description,
						Web3.utils.toWei(amount, "ether"),
						recipientAddress
					)
					.send({ from: accounts[0] });
				Router.replaceRoute(`/campaigns/${address}/requests`);
			}
		} catch (error) {
			console.log(error);
			setErrorMessages([...errorMessages, error.message]);
			setIsInvalidTransaction(true);
		}
		setIsLoading(false);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "description") {
			setDescription(value);
		}
		if (name === "amount") {
			setAmount(value);
		}
		if (name === "recipientAddress") {
			setRecipientAddress(value);
		}

		setIsValid(true);
		cleanErrors();
	};

	function cleanErrors() {
		setErrorMessages([]);
		setIsInvalidTransaction(false);
	}
	return (
		<Layout>
			<h3>Create a request</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column>
						<Form onSubmit={createNewRequest} error={isInvalidTransaction}>
							<Form.Field width={4}>
								<label>Description</label>
								<input
									name="description"
									value={description}
									onChange={handleChange}
								/>
							</Form.Field>
							<Form.Field width={4}>
								<label>Amount in Either</label>
								<input name="amount" value={amount} onChange={handleChange} />
							</Form.Field>
							<Form.Field width={4}>
								<label>Recipient</label>
								<input
									name="recipientAddress"
									value={recipientAddress}
									onChange={handleChange}
								/>
							</Form.Field>
							<Button loading={isLoading} primary>
								Create
							</Button>
							<Message error header="Oops!" list={errorMessages} />
						</Form>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};
NewRequest.getInitialProps = async (props) => {
	const campaignAddress = props.query.address;
	const campaign = getCampaign(campaignAddress);
	return {
		address: campaignAddress,
		campaign: campaign,
	};
};

export default NewRequest;
