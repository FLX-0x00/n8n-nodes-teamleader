import type { ICredentialType, ICredentialTestRequest, INodeProperties, Icon } from 'n8n-workflow';

export class TeamleaderOAuth2Api implements ICredentialType {
	name = 'teamleaderOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Teamleader OAuth2 API';

	documentationUrl = 'https://developer.teamleader.eu/';

    icon: Icon = 'file:teamleader.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'To obtain the Client ID and Client Secret for this integration, log into your Teamleader account. Go to the Marketplace, create a new integration (it doesn’t have to be public), and copy the provided Client ID and Client Secret.',
			name: 'instructions',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://app.teamleader.eu/oauth2/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://app.teamleader.eu/oauth2/access_token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];

	// Test configuration to verify credentials
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.focus.teamleader.eu',  // Base URL für die API
			url: '/users.me',  // Test-Endpoint für Authentifizierung
		},
	};
}
