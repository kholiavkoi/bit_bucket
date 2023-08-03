export class BitbucketDataProvider {
	constructor(data) {
		this.token = data.token;
		this.url = data.url;
		this.repoHost = data.repoHost;
		this.repoSlug = data.repoSlug;
		this.baseUrl = `${this.url}/${this.repoHost}/${this.repoSlug}`;
	}

	// Retrieve the package.json file from a specific branch
	async retrievePackageJson(fileName, branchName) {
		try {
			return await this.request(`src/${branchName}/${fileName}`);
		} catch (e) {
			console.error(e);
			throw new Error(e);
		}
	}

	// Create a new branch based on an existing one
	async createBranch(branchName, fromBranch) {
		try {
			return await this.request(
				'refs/branches',
				'POST',
				{ 'Content-Type': 'application/json' },
				JSON.stringify({
					name: branchName,
					target: {
						hash: fromBranch,
					},
				})
			);
		} catch (e) {
			console.error('Failed to create branch.', e.message);
			throw e;

		}
	}

	// Commit changes to a branch
	// TODO: This endpoint always returns success response, even if there is error - add validation (problem in REST API BitBucket)
	async commitChanges(message, fileName, fileContent, branch) {
		try {
			const formData = new FormData();

			formData.append('branch', branch);
			formData.append('message', message);
			formData.append(fileName, fileContent);

			return await this.request(`src`, 'POST', {}, formData);
		} catch (error) {
			console.error('Commit failed.', error.message);
			throw error;
		}
	}

	// Create a pull request
	async createPullRequest(name, source, branch) {
		try {
			return await this.request(
				`pullrequests`,
				'POST',
				{ 'Content-Type': 'application/json' },
				JSON.stringify({
					title: name,
					source: {
						branch: {
							name: source,
						},
					},
					destination: {
						branch: {
							name: branch,
						},
					},
					close_source_branch: true,
				})
			);
		} catch (error) {
			console.error('Failed to create pull request.', error.message);
			throw error;
		}
	}

	// Generic method for making API requests
	async request(path = '', method = 'GET', headers = {}, body) {
		const response = await fetch(`${this.baseUrl}/${path}`, {
			method,
			headers: {
				...headers,
				'Authorization': `Bearer ${this.token}`,
			},
			body,
		});

		if (body instanceof FormData) {
			return response.text();
		} else {
			return response.json();
		}
	}
}
