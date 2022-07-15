const Meteor = global.Package['meteor'].Meteor;

const defaultOptions = {
	authorizationHeaderName: 'authorization',
	user: true,
	fields: null,
};

const meteorConnectUserContext = (params) => async (req, res, next) => {
	const _params = {
		...defaultOptions,
		...params,
	};
	const { authorizationHeaderName, fields } = _params;
	const includesUserDocument = _params.user;
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
				user = await Meteor.users.findOne({
					'services.resume.loginTokens.hashedToken': hashedToken,
				});
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

export default meteorConnectUserContext;
