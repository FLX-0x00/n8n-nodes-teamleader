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
					{ name: 'Contacts', value: 'contact'},
					{ name: 'Companies', value: 'company' },
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
			// Operations for Contacts
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'contact'
						],
					},
				},
				options: [
					{ name: 'List', value: 'contacts.list', description: 'Get a list of all contacts.' },
					{ name: 'Info', value: 'contacts.info', description: 'Get details for a single contact.' },
					{ name: 'Add', value: 'contacts.add', description: 'Add a new contact.' },
					{ name: 'Update', value: 'contacts.update', description: 'Update a contact.' },
					{ name: 'Delete', value: 'contacts.delete', description: 'Delete a contact.' },
					{ name: 'Link to company', value: 'contacts.linkToCompany', description: 'Link a contact to a company.' },
					{ name: 'Unlink from company', value: 'contacts.unlinkFromCompany', description: 'Unlink a contact from a company.' },
					{ name: 'Update company link', value: 'contacts.updateCompanyLink', description: 'Update the link between a contact and a company.' }

				],
				default: 'contacts.list',
				description: 'The operation to perform.',
			},
			{ displayName: 'First Name', name: 'first_name', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: false, description: 'The first name of the contact.' },
			{ displayName: 'Last Name', name: 'last_name', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: true, description: 'The last name of the contact.' },
			{ displayName: 'Salutation', name: 'salutation', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: false, description: 'The salutation of the contact.' },
			{ displayName: 'Website', name: 'website', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: false, description: 'The website of the contact.' },
			{ displayName: 'Birthday', name: 'birthday', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: false, description: 'The birthday of the contact. Format: YYYY-MM-DD' },
			{ displayName: 'Language', name: 'language', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: false, description: 'The language of the contact.' },
			{ displayName: 'Remarks', name: 'remarks', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: '', required: false, description: 'The remarks of the contact.' },
			{ displayName: 'Marketing Mails Consent', name: 'marketing_mails_consent', type: 'boolean', displayOptions: { show: { operation: ['contacts.add', 'contacts.update'] } }, default: false, required: false, description: 'Whether the contact has given consent to receive marketing mails.' },
			{ displayName: 'Company ID', name: 'company_id', type: 'string', displayOptions: { show: { operation: ['contacts.add', 'contacts.update', 'contacts.linkToCompany', 'contacts.unlinkFromCompany', 'contacts.updateCompanyLink'] } }, default: '', required: true, description: 'The ID of the company the contact is linked to.' },
			{ displayName: 'Position', name: 'position', type: 'string', displayOptions: { show: { operation: ['contacts.linkToCompany', 'contacts.updateCompanyLink'] } }, default: '', required: false, description: 'The position of the contact.' },
			{ displayName: 'Decision Maker', name: 'decision_maker', type: 'boolean', displayOptions: { show: { operation: ['contacts.linkToCompany', 'contacts.updateCompanyLink'] } }, default: false, required: false, description: 'Whether the contact is a decision maker.' },
			// Operations for Companies
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'company'
						],
					},
				},
				options: [
					{ name: 'List', value: 'companies.list', description: 'Get a list of all companies.' },
					{ name: 'Info', value: 'companies.info', description: 'Get details for a single company.' },
					{ name: 'Add', value: 'companies.add', description: 'Add a new company.' },
					{ name: 'Update', value: 'companies.update', description: 'Update a company.' },
					{ name: 'Delete', value: 'companies.delete', description: 'Delete a company.' },
				],
				default: 'companies.list',
				description: 'The operation to perform.',
			},
			{ displayName: 'Name', name: 'name', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: true, description: 'The name of the company.' },
			{ displayName: 'VAT Number', name: 'vat_number', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: false, description: 'The VAT number of the company.' },
			{ displayName: 'Emails', name: 'emails', type: 'fixedCollection', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, typeOptions: { multipleValues: true }, default: {}, placeholder: 'Add Email', options: [ { name: 'email', displayName: 'Email', values: [ { displayName: 'Type', name: 'type', type: 'options', options: [ { value: 'primary', name: 'Primary' }, { value: 'secondary', name: 'Secondary' } ], default: 'primary' }, { displayName: 'Email Address', name: 'email', type: 'string', default: '', required: true } ] } ] },
			{ displayName: 'Addresses', name: 'addresses', type: 'fixedCollection', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, typeOptions: { multipleValues: true }, default: {}, placeholder: 'Add Address', options: [ { name: 'address', displayName: 'Address', values: [ { displayName: 'Type', name: 'type', type: 'options', options: [ { value: 'invoicing', name: 'Invoicing' }, { value: 'shipping', name: 'Shipping' } ], default: 'invoicing' }, { displayName: 'Addressee', name: 'addressee', type: 'string', default: '' }, { displayName: 'Line 1', name: 'line_1', type: 'string', default: '', required: true }, { displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' }, { displayName: 'City', name: 'city', type: 'string', default: '' }, { displayName: 'Country', name: 'country', type: 'string', default: '' } ] } ] },
			{ displayName: 'Telephones', name: 'telephones', type: 'fixedCollection', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, typeOptions: { multipleValues: true }, default: {}, placeholder: 'Add Telephone', options: [ { name: 'telephone', displayName: 'Telephone', values: [ { displayName: 'Type', name: 'type', type: 'options', options: [ { value: 'phone', name: 'Phone' }, { value: 'mobile', name: 'Mobile' } ], default: 'phone' }, { displayName: 'Number', name: 'number', type: 'string', default: '', required: true } ] } ] },
			{ displayName: 'Website', name: 'website', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: false, description: 'The website of the company.' },
			{ displayName: 'IBAN', name: 'iban', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: false, description: 'The IBAN of the company.' },
			{ displayName: 'BIC', name: 'bic', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: false, description: 'The BIC of the company.' },
			{ displayName: 'Language', name: 'language', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: false, description: 'The language of the company.' },
			{ displayName: 'Remarks', name: 'remarks', type: 'string', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: '', required: false, description: 'The remarks of the company.' },
			{ displayName: 'Marketing Mails Consent', name: 'marketing_mails_consent', type: 'boolean', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: false, required: false, description: 'Whether the company has given consent to receive marketing mails.' },
			{ displayName: 'Preferred Currency', name: 'preferred_currency', type: 'options', displayOptions: { show: { operation: ['companies.add', 'companies.update'] } }, default: 'EUR', required: false, description: 'The preferred currency of the company.', options: [ { name: 'BAM', value: 'BAM' }, { name: 'CAD', value: 'CAD' }, { name: 'CHF', value: 'CHF' }, { name: 'CLP', value: 'CLP' }, { name: 'CNY', value: 'CNY' }, { name: 'COP', value: 'COP' }, { name: 'CZK', value: 'CZK' }, { name: 'DKK', value: 'DKK' }, { name: 'EUR', value: 'EUR' }, { name: 'GBP', value: 'GBP' }, { name: 'INR', value: 'INR' }, { name: 'ISK', value: 'ISK' }, { name: 'JPY', value: 'JPY' }, { name: 'MAD', value: 'MAD' }, { name: 'MXN', value: 'MXN' }, { name: 'NOK', value: 'NOK' }, { name: 'PEN', value: 'PEN' }, { name: 'PLN', value: 'PLN' }, { name: 'RON', value: 'RON' }, { name: 'SEK', value: 'SEK' }, { name: 'TRY', value: 'TRY' }, { name: 'USD', value: 'USD' }, { name: 'ZAR', value: 'ZAR' } ], },
					
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
							'contacts.add',
							'contacts.update',
							'contacts.delete',
							'contacts.linkToCompany',
							'contacts.unlinkFromCompany',
							'contacts.updateCompanyLink'
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
				// remove any parameters that have a value of undefined, null, empty strings, or empty arrays
				// remove any parameters that have a value of undefined, null, empty strings, or empty arrays
				const cleaned_parameters = Object.entries(all_parameters).reduce((acc, [key, value]) => {
					if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
						let fieldValue = this.getNodeParameter(key, i) as IDataObject | IDataObject[];

						// If the fieldValue is a string, assign directly
						if (typeof fieldValue === 'string') {
							acc[key] = fieldValue;
						}
						// If the fieldValue is an array, add the array as it is (if it is not empty)
						else if (Array.isArray(fieldValue) && fieldValue.length > 0) {
							acc[key] = fieldValue;
						}
						// If the fieldValue is an object, add it directly without converting it
						else if (typeof fieldValue === 'object' && Object.keys(fieldValue).length > 0) {
							acc[key] = fieldValue;
						}
						// For boolean values, assign them directly
						else if (typeof fieldValue === 'boolean') {
							acc[key] = fieldValue;
						}
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
