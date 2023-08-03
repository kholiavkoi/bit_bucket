Code Usage Instructions
This README.md file provides instructions on how to use the given code, which is designed to automate the process of updating package versions in a Bitbucket repository and creating a pull request. The code is written in JavaScript and uses the inquirer library for user prompts and interactions.

Prerequisites
Before using the code, make sure you have the following prerequisites set up:

Node.js and npm: Make sure you have Node.js and npm (Node Package Manager) installed on your system.

Environment Variables: The code uses environment variables to access sensitive information. Ensure you have a .env file in the same directory as your code with the following variables:

NPM_URL: The URL for the npm data provider.
BITBUCKET_TOKEN: Your Bitbucket personal access token.
BITBUCKET_URL: The URL for your Bitbucket repository.
PACKAGE_JSON: The path to the package.json file in your repository.
BRANCH: The base branch where the changes will be committed and the pull request will be created.

Installation
Clone the Repository: Clone the repository containing the code to your local machine.

Install Dependencies: Open a terminal and navigate to the cloned repository's directory. Run the following command to install the required dependencies:
npm install

Usage

Run the Script: The script uses the inquirer library to prompt you with questions. Run the script using the following command:
node index.js

Answer the prompted questions:

repoHost: The host for your repository (e.g., github.com).
repoSlug: The slug of your repository.
packageName: The name of the package you want to update.
packageVersion: The new version you want to set for the package.

Review and Confirm: The script will provide feedback about the update process, including whether the update was successful or encountered an error.

The code will automate the process of updating the package version in the package.json file, creating a new branch, committing the changes, and opening a pull request in your Bitbucket repository.
