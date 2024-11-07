import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
    JsonObject,
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
        requestDefaults: {
			baseURL: 'https://api.focus.teamleader.eu',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'User',
						value: 'user',
					},
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
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Retrieve all users',
					},
				],
				default: 'getAll',
				description: 'The operation to perform.',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['user'],
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
        const baseURL = 'https://api.focus.teamleader.eu';

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'user') {
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i) as number;

						// API request parameters
						const qs = { page: { size: limit } };

						// Make API request
						const responseData = await this.helpers.requestOAuth2.call(this, 'teamleaderOAuth2Api', {
							method: 'GET',
                            baseURL: baseURL,
							url:  '/users.list',  // Relative URL, baseURL is added automatically
							qs,
                            json: true
						}, { tokenType: 'Bearer' });
                        
                        if (responseData.data === undefined) {
                            throw new NodeApiError(this.getNode(), responseData as JsonObject, {
                                message: 'No data got returned',
                            });
                        }

						// Process and add response data
						returnData.push(...responseData.data);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw new NodeApiError(this.getNode(), error);
			}
		}

		// Return the collected data
		return [this.helpers.returnJsonArray(returnData)];
	}
}
