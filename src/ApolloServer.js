import React from 'react';
import App from './App';
import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	createHttpLink,
} from '@apollo/client';
import { setContext } from 'apollo-link-context'; // Works as a midware

const httpLink = createHttpLink({
	// uri: 'http://localhost:5000',
	uri: 'https://warm-wildwood-61045.herokuapp.com/',
});

const authLink = setContext(() => {
	const token = localStorage.getItem('jwtToken');
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink), // Adds token to request n send protected API
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
