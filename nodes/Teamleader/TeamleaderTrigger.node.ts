/* eslint-disable */
import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionType } from 'n8n-workflow';

export class TeamleaderTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teamleader Trigger',
		documentationUrl: 'https://developer.teamleader.eu/',
		name: 'teamleaderTrigger',
		icon: 'file:teamleader.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Teamleader events occur.',
		defaults: {
			name: 'Teamleader Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'teamleaderOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'multiOptions',
				options: [
					{ name: 'Account Deactivated', value: 'account.deactivated' },
					{ name: 'Account Deleted', value: 'account.deleted' },
					{ name: 'Call Added', value: 'call.added' },
					{ name: 'Call Completed', value: 'call.completed' },
					{ name: 'Call Deleted', value: 'call.deleted' },
					{ name: 'Call Updated', value: 'call.updated' },
					{ name: 'Company Added', value: 'company.added' },
					{ name: 'Company Deleted', value: 'company.deleted' },
					{ name: 'Company Updated', value: 'company.updated' },
					{ name: 'Contact Added', value: 'contact.added' },
					{ name: 'Contact Deleted', value: 'contact.deleted' },
					{ name: 'Contact Linked To Company', value: 'contact.linkedToCompany' },
					{ name: 'Contact Unlinked From Company', value: 'contact.unlinkedFromCompany' },
					{ name: 'Contact Updated Link To Company', value: 'contact.updatedLinkToCompany' },
					{ name: 'Contact Updated', value: 'contact.updated' },
					{ name: 'Credit Note Booked', value: 'creditNote.booked' },
					{ name: 'Credit Note Deleted', value: 'creditNote.deleted' },
					{ name: 'Credit Note Sent', value: 'creditNote.sent' },
					{ name: 'Credit Note Updated', value: 'creditNote.updated' },
					{ name: 'Deal Created', value: 'deal.created' },
					{ name: 'Deal Deleted', value: 'deal.deleted' },
					{ name: 'Deal Lost', value: 'deal.lost' },
					{ name: 'Deal Moved', value: 'deal.moved' },
					{ name: 'Deal Updated', value: 'deal.updated' },
					{ name: 'Deal Won', value: 'deal.won' },
					{ name: 'Invoice Booked', value: 'invoice.booked' },
					{ name: 'Invoice Deleted', value: 'invoice.deleted' },
					{ name: 'Invoice Drafted', value: 'invoice.drafted' },
					{ name: 'Invoice Payment Registered', value: 'invoice.paymentRegistered' },
					{ name: 'Invoice Payment Removed', value: 'invoice.paymentRemoved' },
					{ name: 'Invoice Sent', value: 'invoice.sent' },
					{ name: 'Invoice Updated', value: 'invoice.updated' },
					{ name: 'Meeting Created', value: 'meeting.created' },
					{ name: 'Meeting Completed', value: 'meeting.completed' },
					{ name: 'Meeting Deleted', value: 'meeting.deleted' },
					{ name: 'Meeting Updated', value: 'meeting.updated' },
					{ name: 'Milestone Created', value: 'milestone.created' },
					{ name: 'Milestone Updated', value: 'milestone.updated' },
					{ name: 'Nextgen Project Created', value: 'nextgenProject.created' },
					{ name: 'Nextgen Project Updated', value: 'nextgenProject.updated' },
					{ name: 'Nextgen Project Closed', value: 'nextgenProject.closed' },
					{ name: 'Nextgen Project Deleted', value: 'nextgenProject.deleted' },
					{ name: 'Product Added', value: 'product.added' },
					{ name: 'Product Updated', value: 'product.updated' },
					{ name: 'Product Deleted', value: 'product.deleted' },
					{ name: 'Project Created', value: 'project.created' },
					{ name: 'Project Deleted', value: 'project.deleted' },
					{ name: 'Project Updated', value: 'project.updated' },
					{ name: 'Subscription Added', value: 'subscription.added' },
					{ name: 'Subscription Deactivated', value: 'subscription.deactivated' },
					{ name: 'Subscription Deleted', value: 'subscription.deleted' },
					{ name: 'Subscription Updated', value: 'subscription.updated' },
					{ name: 'Task Completed', value: 'task.completed' },
					{ name: 'Task Created', value: 'task.created' },
					{ name: 'Task Deleted', value: 'task.deleted' },
					{ name: 'Task Updated', value: 'task.updated' },
					{ name: 'Ticket Closed', value: 'ticket.closed' },
					{ name: 'Ticket Created', value: 'ticket.created' },
					{ name: 'Ticket Deleted', value: 'ticket.deleted' },
					{ name: 'Ticket Reopened', value: 'ticket.reopened' },
					{ name: 'Ticket Updated', value: 'ticket.updated' },
					{ name: 'Ticket Message Added', value: 'ticketMessage.added' },
					{ name: 'Time Tracking Added', value: 'timeTracking.added' },
					{ name: 'Time Tracking Deleted', value: 'timeTracking.deleted' },
					{ name: 'Time Tracking Updated', value: 'timeTracking.updated' },
					{ name: 'User Deactivated', value: 'user.deactivated' },
				],
				default: [],
				description: 'The event that will trigger the webhook',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');

				const baseURL = 'https://api.focus.teamleader.eu';
				const method = 'POST' as IHttpRequestMethods;
				const operation = '/webhooks.list';

				const options: IRequestOptions = {
					method,
					baseURL,
					url: operation,
					json: true,
				};

				let responseData;

				try {
					responseData = await this.helpers.requestOAuth2.call(this, 'teamleaderOAuth2Api', options, { tokenType: 'Bearer' });
				} catch (error) {
					throw new NodeApiError(this.getNode(), error);
				}

				if (responseData === undefined) {
					return false;
				}

				if (responseData.data === undefined) {
					return false;
				}

				for (const webhook of responseData.data) {
					if (webhook.url === webhookUrl) {
						webhookData.webhookEvents = webhook.types;
						return true;
					}
				}

				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event');
				const baseURL = 'https://api.focus.teamleader.eu';
				const method = 'POST' as IHttpRequestMethods;
				const operation = '/webhooks.register';
				const body: IDataObject = {
					url: webhookUrl,
					types: event,
				};

				const options: IRequestOptions = {
					method,
					baseURL,
					url: operation,
					json: true,
					body: { ...body },
				};

				let responseData = 0;

				try {
					responseData = await this.helpers.requestOAuth2.call(this, 'teamleaderOAuth2Api', options, { tokenType: 'Bearer' });
				} catch (error) {
					throw new NodeApiError(this.getNode(), error);
				}

				// Check if the response data undefined that the webhook was registered (successful) without any errors so return
				if (responseData === undefined) {
					// Required data is missing so was successful
					return true;
				} else {
					return false;
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const baseURL = 'https://api.focus.teamleader.eu';
				const method = 'POST' as IHttpRequestMethods;
				const operation = '/webhooks.unregister';
				const event = this.getNodeParameter('event');
				const webhookUrl = this.getNodeWebhookUrl('default');

				const options: IRequestOptions = {
					method,
					baseURL,
					url: operation,
					json: true,
					body: {
						url: webhookUrl,
						types: event,
					},
				};

				try {
					await this.helpers.requestOAuth2.call(this, 'teamleaderOAuth2Api', options, { tokenType: 'Bearer' });
					return true;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error);
				}
			}
		}
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData),
			],
		};
	}
}
