import React from "react";
import { Menu, Button, Container } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
	return (
		<Menu style={{ marginTop: "10px" }}>
			<Link route="/">
				<a className="item">CrowdCoin</a>
			</Link>
			<Menu.Menu position="right">
				<Link route="/campaigns/new">
					<Button content="Campaign" icon="add circle" labelPosition="right" />
				</Link>
			</Menu.Menu>
		</Menu>
	);
};

export default Header;
