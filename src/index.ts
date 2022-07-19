declare global {
	var Package: any;
}

var Meteor: any = global.Package['meteor'].Meteor;
var Accounts: any = global.Package['accounts-base'].Accounts;

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

interface MeteorConnectUserContextParams {
	authorizationHeaderName?: string;
	user?: boolean;
	fields?: object | null;
}

const defaultOptions: MeteorConnectUserContextParams = {
	authorizationHeaderName: 'authorization',
	user: true,
	fields: null,
};

const meteorConnectUserContext =
	(params?: MeteorConnectUserContextParams) =>
	async (req: any, res: any, next: any) => {
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

				const project: any = {};
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

export const meteorFetch = (url: string, options: any) => {
	return fetch(url, {
		...options,
		headers: {
			Authorization: Meteor._localStorage.getItem('Meteor.loginToken'),
			...options.headers,
		},
	});
};

export default meteorConnectUserContext;
