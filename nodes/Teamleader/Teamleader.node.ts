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
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Project', value: 'project' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Milestone', value: 'milestone' },
					{ name: 'Product', value: 'product' },
					{ name: 'Quotation', value: 'quotation' },
					{ name: 'Subscription', value: 'subscription' },
					{ name: 'Ticket', value: 'ticket' },
					{ name: 'Work Type', value: 'workType' },
				],
				default: 'user',
				noDataExpression: true,
				description: 'The resource to operate on.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'user',
							'company',
							'contact',
							'deal',
							'project',
							'invoice',
							'milestone',
							'product',
							'quotation',
							'subscription',
							'ticket',
							'workType',
						],
					},
				},
				options: [
					{ name: 'Get', value: 'get', description: 'Retrieve a single item' },
					{ name: 'Get Many', value: 'getAll', description: 'Retrieve multiple items' },
                    { name: 'Download', value: 'download', description: 'Download a file', displayOptions: { show: { resource: ['invoice'] } } },
					{ name: 'Create', value: 'create', description: 'Create a new item' },
					{ name: 'Update', value: 'update', description: 'Update an existing item' },
					{ name: 'Delete', value: 'delete', description: 'Delete an item' },
				],
				default: 'getAll',
				description: 'The operation to perform.',
			},
			{
				displayName: 'Item ID',
				name: 'id',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete', 'download'],
						resource: [
							'user',
							'company',
							'contact',
							'deal',
							'project',
							'invoice',
							'milestone',
							'product',
							'quotation',
							'subscription',
							'ticket',
							'workType',
						],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the item to operate on.',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: [
							'user',
							'company',
							'contact',
							'deal',
							'project',
							'invoice',
							'milestone',
							'product',
							'quotation',
							'subscription',
							'ticket',
							'workType',
						],
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Limit the number of results returned',
			},
            { displayName: 'Format', name: 'format', type: 'options', options: [ { name: 'PDF', value: 'pdf' }, { name: 'ubl/e-fff', value: 'ubl/e-fff' } ], default: 'pdf', displayOptions: { show: { resource: ['invoice'], operation: ['download'] } }, description: 'The format of the invoice to download.' },
            { displayName: 'E-Mail', name: 'email', type: 'string', default: '', displayOptions: { show: { resource: ['user', 'contact'], operation: ['create', 'update'] } }, description: 'The email address of the user or contact.' },
            { displayName: 'First Name', name: 'firstName', type: 'string', default: '', displayOptions: { show: { resource: ['user', 'contact'], operation: ['create', 'update'] } }, description: 'The first name of the user or contact.' },
            { displayName: 'Last Name', name: 'lastName', type: 'string', default: '', displayOptions: { show: { resource: ['user', 'contact'], operation: ['create', 'update'] } }, description: 'The last name of the user or contact.' },
            { displayName: 'Company Name', name: 'companyName', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['create', 'update'] } }, description: 'The name of the company.' },
            { displayName: 'VAT Number', name: 'vatNumber', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['create', 'update'] } }, description: 'The VAT number of the company.' },
            { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', displayOptions: { show: { resource: ['user', 'contact', 'company'], operation: ['create', 'update'] } }, description: 'The phone number of the user, contact, or company.' },
            { displayName: 'Address', name: 'address', type: 'string', default: '', displayOptions: { show: { resource: ['contact', 'company'], operation: ['create', 'update'] } }, description: 'The address of the contact or company.' },
            { displayName: 'Title', name: 'title', type: 'string', default: '', displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } }, description: 'The title of the contact.' },
            { displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 4 }, default: '', displayOptions: { show: { resource: ['deal', 'project', 'ticket', 'invoice', 'quotation'], operation: ['create', 'update'] } }, description: 'The description of the deal, project, ticket, invoice, or quotation.' },
            { displayName: 'Amount', name: 'amount', type: 'number', default: 0, typeOptions: { minValue: 0 }, displayOptions: { show: { resource: ['deal', 'invoice', 'quotation', 'product'], operation: ['create', 'update'] } }, description: 'The amount for the deal, invoice, quotation, or product.' },
            { displayName: 'Currency', name: 'currency', type: 'string', default: 'EUR', displayOptions: { show: { resource: ['deal', 'invoice', 'quotation'], operation: ['create', 'update'] } }, description: 'The currency for the deal, invoice, or quotation.' },
            { displayName: 'Status', name: 'status', type: 'options', options: [ { name: 'Open', value: 'open' }, { name: 'Closed', value: 'closed' }, { name: 'Pending', value: 'pending' } ], default: 'open', displayOptions: { show: { resource: ['deal', 'project', 'ticket', 'invoice'], operation: ['update'] } }, description: 'The status of the deal, project, ticket, or invoice.' },
            { displayName: 'Website', name: 'website', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['create', 'update'] } }, description: 'The website of the company.' },
            { displayName: 'Industry', name: 'industry', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['create', 'update'] } }, description: 'The industry sector of the company.' },
            { displayName: 'Source', name: 'source', type: 'string', default: '', displayOptions: { show: { resource: ['contact', 'deal'], operation: ['create', 'update'] } }, description: 'The source of the contact or deal.' },
            { displayName: 'Priority', name: 'priority', type: 'options', options: [ { name: 'Low', value: 'low' }, { name: 'Medium', value: 'medium' }, { name: 'High', value: 'high' } ], default: 'medium', displayOptions: { show: { resource: ['ticket', 'deal', 'project'], operation: ['create', 'update'] } }, description: 'The priority level of the ticket, deal, or project.' },
            { displayName: 'Due Date', name: 'dueDate', type: 'dateTime', default: '', displayOptions: { show: { resource: ['project', 'ticket', 'invoice'], operation: ['create', 'update'] } }, description: 'The due date of the project, ticket, or invoice.' },
            { displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '', displayOptions: { show: { resource: ['project'], operation: ['create', 'update'] } }, description: 'The start date of the project.' },
            { displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '', displayOptions: { show: { resource: ['project'], operation: ['create', 'update'] } }, description: 'The end date of the project.' },
            { displayName: 'Assigned To', name: 'assignedTo', type: 'string', default: '', displayOptions: { show: { resource: ['ticket', 'deal', 'project'], operation: ['create', 'update'] } }, description: 'The user assigned to the ticket, deal, or project.' },
            { displayName: 'Company Size', name: 'companySize', type: 'number', default: 0, typeOptions: { minValue: 1 }, displayOptions: { show: { resource: ['company'], operation: ['create', 'update'] } }, description: 'The size of the company in terms of employees.' },
            { displayName: 'Notes', name: 'notes', type: 'string', typeOptions: { rows: 4 }, default: '', displayOptions: { show: { resource: ['contact', 'deal', 'ticket', 'company'], operation: ['create', 'update'] } }, description: 'Additional notes for the contact, deal, ticket, or company.' },
            { displayName: 'Payment Term', name: 'paymentTerm', type: 'number', default: 0, typeOptions: { minValue: 0 }, displayOptions: { show: { resource: ['invoice', 'quotation'], operation: ['create', 'update'] } }, description: 'The payment term in days for the invoice or quotation.' },
            { displayName: 'Discount', name: 'discount', type: 'number', default: 0, typeOptions: { minValue: 0, maxValue: 100 }, displayOptions: { show: { resource: ['invoice', 'quotation', 'product'], operation: ['create', 'update'] } }, description: 'The discount percentage for the invoice, quotation, or product.' },
            { displayName: 'Tax Rate', name: 'taxRate', type: 'number', default: 0, typeOptions: { minValue: 0, maxValue: 100 }, displayOptions: { show: { resource: ['invoice', 'quotation', 'product'], operation: ['create', 'update'] } }, description: 'The tax rate percentage for the invoice, quotation, or product.' },
            { displayName: 'Category', name: 'category', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['create', 'update'] } }, description: 'The category of the product.' },
            { displayName: 'SKU', name: 'sku', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['create', 'update'] } }, description: 'The stock keeping unit identifier for the product.' },
            { displayName: 'Stock Level', name: 'stockLevel', type: 'number', default: 0, typeOptions: { minValue: 0 }, displayOptions: { show: { resource: ['product'], operation: ['create', 'update'] } }, description: 'The current stock level of the product.' }
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const baseURL = 'https://api.focus.teamleader.eu';

		const resource = this.getNodeParameter('resource', 0) as keyof typeof endpoints;
		const operation = this.getNodeParameter('operation', 0) as keyof typeof endpoints['user'];

		// Each endpoint now includes the method as well as URL
		const endpoints = {
			user: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/users.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/users.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/users.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/users.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/users.delete' }
			},
			company: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/companies.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/companies.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/companies.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/companies.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/companies.delete' }
			},
			contact: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/contacts.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/contacts.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/contacts.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/contacts.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/contacts.delete' }
			},
			deal: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/deals.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/deals.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/deals.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/deals.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/deals.delete' }
			},
			project: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/projects.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/projects.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/projects.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/projects.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/projects.delete' }
			},
			invoice: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/invoices.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/invoices.info' },
                download: { method: 'POST' as IHttpRequestMethods, url: '/invoices.download' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/invoices.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/invoices.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/invoices.delete' }
			},
			milestone: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/milestones.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/milestones.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/milestones.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/milestones.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/milestones.delete' }
			},
			product: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/products.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/products.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/products.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/products.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/products.delete' }
			},
			quotation: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/quotations.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/quotations.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/quotations.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/quotations.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/quotations.delete' }
			},
			subscription: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/subscriptions.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/subscriptions.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/subscriptions.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/subscriptions.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/subscriptions.delete' }
			},
			ticket: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/tickets.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/tickets.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/tickets.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/tickets.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/tickets.delete' }
			},
			workType: {
				getAll: { method: 'POST' as IHttpRequestMethods, url: '/workTypes.list' },
				get: { method: 'POST' as IHttpRequestMethods, url: '/workTypes.info' },
				create: { method: 'POST' as IHttpRequestMethods, url: '/workTypes.create' },
				update: { method: 'POST' as IHttpRequestMethods, url: '/workTypes.update' },
				delete: { method: 'POST' as IHttpRequestMethods, url: '/workTypes.delete' }
			},
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const { method, url } = endpoints[resource][operation];
				let responseData;
				const limit = this.getNodeParameter('limit', i, 50) as number;

				const additionalFields = this.getNode().parameters as IDataObject || {};
				const qs: IDataObject = { page: { size: limit } };

				const options: IRequestOptions = {
					method,
					baseURL,
					url,
					json: true,
					...(operation === 'getAll' ? { body: { ...qs } } : { body: { ...additionalFields } }),
				};

				responseData = await this.helpers.requestOAuth2.call(this, 'teamleaderOAuth2Api', options, { tokenType: 'Bearer' });

				if (responseData.data === undefined) {
					throw new NodeApiError(this.getNode(), responseData as JsonObject, {
						message: 'No data got returned',
					});
				}
                
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
