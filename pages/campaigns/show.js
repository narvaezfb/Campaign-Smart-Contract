import React from "react";
import Layout from "./../../components/layout";
import {
	Container,
	Grid,
	Button,
	Form,
	Message,
	Card,
} from "semantic-ui-react";
import getCampaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/contributeForm";
import { Link } from "../../routes";

const Show = ({
	address,
	minimunContribution,
	balance,
	approversCount,
	requestsLength,
	manager,
}) => {
	const items = [
		{
			header: manager,
			meta: "Address of manager",
			description:
				"The manager created this campaign and can create requests to withdraw money",
			style: { overflowWrap: "break-word" },
		},
		{
			header: minimunContribution,
			meta: "Minimun Contribution (wei)",
			description:
				"You must contribute at least this much wei to become an approver",
			style: { overflowWrap: "break-word" },
		},
		{
			header: requestsLength,
			meta: "Number of Requests",
			description:
				"A request tries tp withdraw money from the contract. Requests must be approved by approvers",
			style: { overflowWrap: "break-word" },
		},
		{
			header: approversCount,
			meta: "Number of Approvers",
			description: "Number of people who have already donated to this campaign",
			style: { overflowWrap: "break-word" },
		},
		{
			header: web3.utils.fromWei(balance, "ether"),
			meta: "Balance on ether",
			description: "The balance is how much money this campaign has to spent",
			style: { overflowWrap: "break-word" },
		},
	];
	return (
		<Layout>
			<h3>Campaign Show</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>
						<Card.Group items={items} />
					</Grid.Column>
					<Grid.Column width={6}>
						<ContributeForm address={address} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link route={`/campaigns/${address}/requests`}>
							<Button primary>Requests</Button>
						</Link>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

Show.getInitialProps = async (props) => {
	const campaignAddress = props.query.address;
	const campaign = getCampaign(campaignAddress);
	const campaignSummary = await campaign.methods.getCampaignSummary().call();
	return {
		address: campaignAddress,
		minimunContribution: campaignSummary[0].toString(),
		balance: campaignSummary[1].toString(),
		approversCount: campaignSummary[2].toString(),
		requestsLength: campaignSummary[3].toString(),
		manager: campaignSummary[4].toString(),
	};
};

export default Show;
