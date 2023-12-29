import React, { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import factory from "./../ethereum/factory";
import Layout from "./../components/layout";
import { Link } from "../routes";

const IndexPage = ({ campaigns }) => {
	console.log(campaigns);
	function displayCampaigns() {
		const items = campaigns.map((campaign) => {
			return {
				header: campaign,
				description: (
					<Link route={`/campaigns/${campaign}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
			};
		});
		return <Card.Group items={items} />;
	}

	return (
		<Layout>
			<div>
				<h3>List of campaigns</h3>
				<Link route="/campaigns/new">
					<Button
						floated="right"
						content="Campaign"
						icon="add circle"
						primary
					/>
				</Link>
				{displayCampaigns()}
			</div>
		</Layout>
	);
};
IndexPage.getInitialProps = async () => {
	const campaigns = await factory.methods.getDeployedCampaigns().call();
	return { campaigns };
};

export default IndexPage;
