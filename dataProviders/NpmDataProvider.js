export class NpmDataProvider {
	constructor(url) {
		this.baseUrl = url
	}

	isPackageEnabled(name, version) {
		return fetch(`${this.baseUrl}/${name}/${version}`)
			.then((response) => {
				return response.status >= 200 && response.status <= 299;
			})
			.catch((error) => {
				console.error('Package could not be verified.', error.message);
				throw error;
			});
	}
}