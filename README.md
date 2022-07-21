# meteor-webapp-user-context

A middleware to get access to Meteor user context in the connect API endpoints (exposed through WebApp.connectHandlers). It sets req.user and req.userId.

## What problem does it solve ?

It's simply`this.userId` equivalent but for http endpoints. It also provides a fetch wrapper with the Meteor user token already set.
Remember that passing userId directly via the request body is not secure (although the connection is encrypted)

## Install

```bash
npm install --save meteor-webapp-user-context
```

## Usage

```js
// client code
import { meteorFetch } from 'meteor-webapp-user-context';

const res = await meteorFetch('/api/private', {
	method: 'POST',
	body: {
		/* your request body */
	},
});

// server code
import connectUserContext from 'meteor-webapp-user-context';

WebApp.connectHandlers.use(connectUserContext());

WebApp.connectHandlers.use('/api/private', async (req, res, next) => {
	console.log(req.userId, req.user);
});
```

### Example with axios and custom authorization header

```js
// client code
res = await axios.get(
	'/api/private',
	{
		/* body */
	},
	{
		headers: {
			// For the middleware to work, you need to pass the login token in "Authorization" header.
			Authorization: Meteor._localStorage.getItem('Meteor.loginToken'),
		},
	}
);
```

## Options

`connectUserContext(options)`
| Attribute | Type | Default value | Description
|---|---|---|---|
| authorizationHeaderName | string | 'authorization' | set a different header for the authorization token. (not recommended) |
| user | boolean | true | define whether the user document should be added to the request |
| fields | object | null | [field specifier](https://docs.meteor.com/api/collections.html#fieldspecifiers) to set which fields should be included in the user document |

## License

MIT © [jonisapp](https://github.com/jonisapp)
