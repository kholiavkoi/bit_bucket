import inquirer from 'inquirer';
import { questions } from './config/questions.js';
import { NpmDataProvider } from './dataProviders/NpmDataProvider.js';
import { BitbucketDataProvider } from './dataProviders/BitbucketDataProvider.js';
import {} from 'dotenv/config'

// TODO: validate repoHost, repoSlug, packageName, packageVersion

// Prompt the user with the questions and handle their responses
inquirer
	.prompt(questions)
	.then(({ repoHost, repoSlug, packageName, packageVersion }) => {
		// Instantiate the necessary data providers and call the 'main' function
		main(
			new NpmDataProvider(process.env.NPM_URL),
			new BitbucketDataProvider({
				token: process.env.BITBUCKET_TOKEN,
				url: process.env.BITBUCKET_URL,
				repoHost,
				repoSlug,
			}),
			packageName,
			packageVersion
		);
	})
	.catch(e => console.log(e));


async function main(npmDataProvider, bitbucketDataProvider, packageName, packageVersion) {
	try {
		// Check if the package is enabled in npm
		const isEnabled = await npmDataProvider.isPackageEnabled(packageName, packageVersion);

		if (!isEnabled) {
			throw new Error('The package was not found.');
		}

		// Retrieve the package.json data from Bitbucket
		const packageJsonData = await bitbucketDataProvider.retrievePackageJson(
			process.env.PACKAGE_JSON,
			process.env.BRANCH
		);

		// Update the package version in package.json if it exists
		if (packageJsonData.dependencies?.[packageName]) {
			packageJsonData.dependencies[packageName] = packageVersion;
		} else {
			throw new Error('Package version not found in package.json');
		}

		// Create a new feature branch with a unique name
		const newBranch = `feature/${packageName}-${packageVersion}-${Date.now()}`;

		// Create a new branch based on the provided branch
		await bitbucketDataProvider.createBranch(newBranch, process.env.BRANCH);

		// Commit the updated package.json to the new branch
		await bitbucketDataProvider.commitChanges(
			`${packageName} was updated to ${packageVersion}`,
			process.env.PACKAGE_JSON,
			JSON.stringify(packageJsonData, null, 2),
			newBranch
		);

		// Create a pull request for the updated package version
		await bitbucketDataProvider.createPullRequest(
			`${packageName} updated to ${packageVersion}`,
			newBranch,
			process.env.BRANCH
		);

		console.log("Update successful.");
	} catch (error) {
		console.error(error?.message);
	}
}



