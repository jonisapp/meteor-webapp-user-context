const Meteor = global.Package['meteor'].Meteor;
const Accounts = global.Package['accounts-base'].Accounts;

/* 
  Throw errors if Meteor or accounts-base are not found
*/

if (!Meteor) {
	throw new Error(
		'meteor-webapp-user-context is intented to work within the Meteor framework exclusively.'
	);
}

if (!Accounts) {
	throw new Error(
		'accounts-base Meteor package must be added to your project.\nYou can add it by typing the command : Meteor add accounts-base'
	);
}

/*
  init
*/

const defaultOptions = {
	authorizationHeaderName: 'authorization',
	user: true,
	fields: null,
};

const meteorConnectUserContext = (params) => async (req, res, next) => {
	const _options = {
		...defaultOptions,
		...params,
	};

	const { authorizationHeaderName, fields } = _options;
	const includesUserDocument = _options.user;
	const token = req.headers[authorizationHeaderName];

	if (token) {
		if (Accounts) {
			const hashedToken = Accounts._hashLoginToken(token);

			let user = null;

			const project = {};
			if (fields) {
				if (typeof fields === 'object') {
					project.fields = fields;
				}
			}

			try {
				user = await Meteor.users.findOne(
					{
						'services.resume.loginTokens.hashedToken': hashedToken,
					},
					project
				);
			} catch (error) {
				res
					.writeHead(401, { 'Content-Type': 'application/json' })
					.end(JSON.stringify({ error }));
			}

			if (!user?._id) {
				res
					.writeHead(401, { 'Content-Type': 'application/json' })
					.end(JSON.stringify({ error: 'Authorization failed' }));
			}

			req.userId = user._id;
			if (includesUserDocument) {
				req.user = user;
			}
		} else {
			res
				.writeHead(401, { 'Content-Type': 'application/json' })
				.end(JSON.stringify({ error: 'Meteor Accounts package not found' }));
		}
	}

	next();
};

/*
  fetch wrapper with pre-configured Authorization header
*/

export const meteorFetch = (url, options) => {
	return fetch(url, {
		...options,
		headers: {
			Authorization: Meteor._localStorage.getItem('Meteor.loginToken'),
			...options.headers,
		},
	});
};

export default meteorConnectUserContext;
