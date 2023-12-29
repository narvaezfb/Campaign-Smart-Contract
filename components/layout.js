import React, { useEffect } from "react";
import Head from "next/head";
import Header from "./../components/header";
import { Container } from "semantic-ui-react";

const Layout = ({ children }) => {
	useEffect(() => {
		// Load Semantic UI stylesheet dynamically on the client side
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css";
		document.head.appendChild(link);

		// Clean up the link element on unmount
		return () => {
			document.head.removeChild(link);
		};
	}, []);
	return (
		<Container>
			<Head>
				{/* Include any other head elements as needed */}
				<title>Your Page Title</title>
				{/* Add meta tags, etc. */}
			</Head>
			<Header />
			{children}
		</Container>
	);
};

export default Layout;
