# Teamleader n8n Node Integration

## Overview
This project is an n8n custom node integration for Teamleader, a popular online CRM platform. The purpose of this integration is to provide a seamless way to connect your workflows in n8n with the various resources offered by Teamleader, including users, contacts, companies, deals, invoices, projects, and more.

Currently, this project is **under active development**, meaning features are being continuously added and refined. Please note that there are still many aspects that are not yet complete or that may be subject to change.

## Features
- OAuth2 authentication with Teamleader.
- Support for CRUD operations across a variety of Teamleader resources, such as Users, Contacts, Companies, Deals, Tickets, and more.
- Flexible parameter handling to allow customization for each resource operation.

## Supported Resources
The following resources and their actions are currently supported:
- **Users**: Create, update, get, and get all.
- **Contacts**: Create, update, get, and get all.
- **Companies**: Create, update, get, and get all.
- **Deals**: Create, update, get, get all, and delete.
- **Projects**: Create, update, get, get all, and delete.
- **Tickets**: Create, update, get, get all, and delete.
- **Invoices**: Create, update, get, get all, download and delete.
- **Quotations**: Create, update, get, get all, and delete.
- **Products**: Create, update, get, get all, and delete.
- **Work Types**: Create, update, get, get all, and delete.

The project aims to support the entirety of Teamleader's API, but **some advanced features like triggers or webhooks are not yet implemented**.

## Disclaimer
**This project is still in development**, and many functionalities are expected to evolve over time. Please use it with caution in production environments as some features might not be fully stable.

If you have ideas for improvements, feature requests, or encounter issues, please check out the GitHub Issues tab to see what's currently planned or in progress. Feel free to contribute by opening an issue or submitting a pull request.

## Getting Started
To use this n8n node:
1. Clone the repository and install dependencies.
2. Build the project and link it to your local n8n instance.
3. Configure the node by providing the necessary credentials (OAuth2 via Teamleader).

Detailed installation instructions are coming soon!

### Requirements
- Node.js
- n8n v1.66.0 or later
- Teamleader API access

## Usage
- **Authentication**: This node uses OAuth2 authentication to connect with Teamleader. You need to set up a new integration via Teamleader's Marketplace to obtain your Client ID and Client Secret.
- **Resources and Operations**: You can add this node to your workflow and use any of the supported resources with the appropriate operations. Parameters are automatically adjusted based on the selected resource.

## Development
This project is open-source and contributions are highly appreciated. Please ensure that all changes are well-tested and consistent with the existing codebase.

### Running Locally
- Clone the repository.
- Run `npm install` to install all required dependencies.
- Use `npm run build` to build the project.
- Start an n8n instance linked with this node.

### Contribution Guidelines
- Please follow the coding standards used throughout the project.
- Open an issue before submitting large changes to discuss your approach.
- Pull requests are reviewed and merged as time permits.

## Roadmap
- [ ] Add support for webhooks and triggers for real-time updates.
- [ ] Improve error handling and logging throughout the node.
- [ ] Integrate all ressources, actions and parameters from the API

## Issues
Please report any issues or bugs using the GitHub Issues page. Contributions to resolve these issues are highly welcome.

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute this code, provided the original author is credited.

---

Thank you for using and contributing to the Teamleader n8n node integration!

