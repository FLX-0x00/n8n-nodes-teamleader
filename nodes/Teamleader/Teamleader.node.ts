import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionType } from 'n8n-workflow';

export class Teamleader implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teamleader',
		name: 'teamleader',
		icon: 'file:teamleader.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Teamleader API',
		defaults: {
			name: 'Teamleader',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'teamleaderOAuth2Api',
				required: true,
				testedBy: {
					request: {
						method: 'GET',
						url: '/users.me',
					},
				},
			},
		],
		properties: [
			// Resources
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Teams', value: 'team' },
					{ name: 'Custom Fields', value: 'customFieldDefinitions' },
					{ name: 'Tickets', value: 'ticket' },
					{ name: 'Ticket Status', value: 'ticketStatus' },
					{ name: 'Deals', value: 'deal' },
					{ name: 'Webhooks', value: 'webhook' },
				],
				default: 'user',
				noDataExpression: true,
				description: 'The resource to operate on.',
			},
			// Operations for each resource
			// Operations for Users
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'user'
						],
					},
				},
				options: [
					{ name: 'Info', value: 'users.info', description: 'Get details for a single user' },
					{ name: 'List', value: 'users.list', description: 'Get a list of all users.' },
					{ name: 'List days off', value: 'users.listDaysOff', description: 'Returns information about days off of a given user.' },
					{ name: 'Get week schedule', value: 'users.getWeekSchedule', description: 'Returns information about week schedule of a user. Only available with the Weekly working schedule feature.' },
				],
				default: 'users.list',
				description: 'The operation to perform.',
			},
			// Operations for Teams
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'team'
						],
					},
				},
				options: [
					{ name: 'List', value: 'teams.list', description: 'Get a list of all teams.' }
				],
				default: 'teams.list',
				description: 'The operation to perform.',
			},
			// Operations for Custom Fields
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'customFieldDefinitions'
						],
					},
				},
				options: [
					{ name: 'List', value: 'customFieldDefinitions.list', description: 'Get a list of all the definitions of custom fields.' },
					{ name: 'Info', value: 'customFieldDefinitions.info', description: 'Get info about a specific custom field definition.' },
				],
				default: 'customFieldDefinitions.list',
				description: 'The operation to perform.',
			},
			// Operations for Tickets
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'ticket'
						],
					},
				},
				options: [
					{ name: 'List', value: 'tickets.list', description: 'Get a list of tickets.' },
					{ name: 'Info', value: 'tickets.info', description: 'Get details for a single ticket.' },
					{ name: 'Create', value: 'tickets.create', description: 'Create a new ticket.' },
					{ name: 'Update', value: 'tickets.update', description: 'Update a ticket.' },
					{ name: 'List messages', value: 'tickets.listMessages', description: 'Get a list of messages for a ticket.' },
					{ name: 'Get message', value: 'tickets.getMessage', description: 'Get a message for a ticket.' },
					{ name: 'Add reply', value: 'tickets.addReply', description: 'Add a reply to a ticket.' },
					{ name: 'Add internal message', value: 'tickets.addInternalMessage', description: 'Add an internal message to a ticket.' },
				],
				default: 'tickets.list',
				description: 'The operation to perform.',
			},
			{ displayName: 'Message ID', name: 'messageId', type: 'string', displayOptions: { show: { operation: ['tickets.getMessage'] } }, default: '', required: true, description: 'The ID of the message to get.' },
			{ displayName: 'Body', name: 'body', type: 'string', displayOptions: { show: { operation: ['tickets.addReply', 'tickets.addInternalMessage'] } }, default: '', required: true, description: 'The body of the reply. Uses HTML formatting.' },
			{ displayName: 'Ticket Status ID', name: 'ticket_status_id', type: 'string', displayOptions: { show: { operation: ['tickets.create', 'tickets.update', 'tickets.addReply', 'tickets.addInternalMessage'] } }, default: '', required: true, description: 'The ID of the status to set the ticket to.' },
			// Operations for Ticket Status
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'ticketStatus'
						],
					},
				},
				options: [
					{ name: 'List', value: 'ticketStatus.list', description: 'Get a list of all ticket statuses.' }
				],
				default: 'ticketStatus.list',
				description: 'The operation to perform.',
			},
			// Operations for Deals
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'deal'
						],
					},
				},
				options: [
					{ name: 'List', value: 'deals.list', description: 'Get a list of all deals.' },
					{ name: 'Info', value: 'deals.info', description: 'Get details for a single deal.' },
					// creating a deal will be implemented in the future because more complex data as input is needed
					//{ name: 'Create', value: 'deals.create', description: 'Create a new deal.' },
					{ name: 'Update', value: 'deals.update', description: 'Update a deal.' },
					{ name: 'Delete', value: 'deals.delete', description: 'Delete a deal.' },
					{ name: 'Move', value: 'deals.move', description: 'Move a deal to a different stage.' },
					{ name: 'Win', value: 'deals.win', description: 'Win a deal.' },
					{ name: 'Lose', value: 'deals.lose', description: 'Lose a deal.' },
				],
				default: 'deals.list',
				description: 'The operation to perform.',
			},
			{ displayName: 'Title', name: 'title', type: 'string', displayOptions: { show: { operation: ['deals.create'] } }, default: '', required: true, description: 'The title of the deal.' },
			{ displayName: 'Title', name: 'title', type: 'string', displayOptions: { show: { operation: ['deals.update'] } }, default: '', required: false, description: 'The title of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Summary', name: 'summary', type: 'string', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: '', required: false, description: 'The summary of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Source ID', name: 'source_id', type: 'string', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: '', required: false, description: 'The source ID of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Department ID', name: 'department_id', type: 'string', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: '', required: false, description: 'The department ID of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Responsible User ID', name: 'responsible_user_id', type: 'string', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: '', required: false, description: 'The responsible user ID of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Phase ID', name: 'phase_id', type: 'string', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: '', required: false, description: 'The phase ID of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Estimated probability', name: 'estimated_probability', type: 'number', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: 0, required: false, description: 'The estimated probability of the deal. Empty values are ignored and cause no overwrite' },
			{ displayName: 'Estimated closing_date', name: 'estimated_closing_date', type: 'string', displayOptions: { show: { operation: ['deals.create', 'deals.update'] } }, default: '', required: false, description: 'The estimated closing date of the deal | Format YYYY-MM-DD. Empty values are ignored and cause no overwrite' },

			// Operations for Webhooks
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'webhook'
						],
					},
				},
				options: [
					{ name: 'List', value: 'webhooks.list', description: 'Get a list of all webhooks.' },
				],
				default: 'webhooks.list',
				description: 'The operation to perform.',
			},
			// ID and Limit
			{	displayName: 'ID',
				name: 'id',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'users.info',
							'customFieldDefinitions.info',
							'users.listDaysOff',
							'users.getWeekSchedule',
							'tickets.info',
							'tickets.update',
							'tickets.listMessages',
							'tickets.addReply',
							'tickets.addInternalMessage',
							'deals.info',
							'deals.update',
							'deals.delete',
							'deals.win',
							'deals.lose',
							'deals.move',
						]
					}
				},
				default: '',
				required: true,
				description: 'The ID of the item to operate on.'
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'The number of results to return.',
				displayOptions: {
					show: {
						operation: [
							'users.list',
							'teams.list',
							'customFieldDefinitions.list',
							'tickets.list',
							'tickets.listMessages',
							'deals.list',
						]
					}
				}
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const baseURL = 'https://api.focus.teamleader.eu';
		const method = 'POST' as IHttpRequestMethods;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				const limit = this.getNodeParameter('limit', i, 0) as number;

				const all_parameters = this.getNode().parameters as IDataObject || {};

				// remove any parameters that have a value of undefined or null or are empty strings
				const cleaned_parameters = Object.entries(all_parameters).reduce((acc, [key, value]) => {
					if (value !== undefined && value !== null && value !== '') {
						acc[key] = this.getNodeParameter(key, i) as IDataObject;
					}
					return acc;
				}, {} as IDataObject);

				const qs: IDataObject = { page: { size: limit } };

				// merge additionalFields with qs
				const data = Object.assign(qs, cleaned_parameters);

				const options: IRequestOptions = {
					method,
					baseURL,
					url: operation,
					json: true,
					body: { ...data },
				};

				// logging the call
				this.logger.debug("Calling Teamleader API with", options);

				responseData = await this.helpers.requestOAuth2.call(this, 'teamleaderOAuth2Api', options, { tokenType: 'Bearer' });

				// if response code is 204, return message that no data was found but the request was successful
				if (responseData === undefined) {
					returnData.push({ message: 'No data returned but request was successful' });
					continue;
				} else {
					if (responseData.data === undefined) {
						throw new NodeApiError(this.getNode(), responseData as JsonObject, {
							message: 'No data got returned',
						});
					}
				}

				// If the data is an array add the data to the returnData
				if (Array.isArray(responseData.data)) {
						returnData.push(...responseData.data);
				} else {
						returnData.push(responseData.data);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw new NodeApiError(this.getNode(), error);
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
