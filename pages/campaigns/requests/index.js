import React from "react";
import web3 from "../../../ethereum/web3";
import getCampaign from "../../../ethereum/campaign";
import Layout from "../../../components/layout";
import { Button, Grid } from "semantic-ui-react";
import { Link } from "../../../routes";

const RequestIndex = ({ address }) => {
	return (
		<Layout>
			<Grid>
				<Grid.Row>
					<Grid.Column>
						<h3>Request List</h3>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link route={`/campaigns/${address}/requests/new`}>
							<Button primary>Create Request</Button>
						</Link>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

RequestIndex.getInitialProps = async (props) => {
	const campaignAddress = props.query.address;
	const campaign = getCampaign(campaignAddress);
	return {
		address: campaignAddress,
	};
};

export default RequestIndex;
