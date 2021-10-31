# Getting Started with AWS-LOGS-VIEWER

This project is a React-Electron project for reading AWS CloudWatch's Log Group's Log Stream's Log Events using your AWS CLI credentials without logging in to the AWS Console.

## Available Scripts

In the project directory, you can run:

### `npm run electron:serve`

Runs the app in the development mode on http://localhost:3000. Electron Application will be opened to view application.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn electron-builder -c.extraMetadata.main=electron/main.js`

Builds the binary files to be run on the OS.

---

## Notes

**Currently, this is only tested on OS X.**

**Once the build is done, change the ```index.html``` references to local directory's content (`./`).**

