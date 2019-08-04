# Environment Files
It always good to have environment specific builds for your application, specially if your application has API's that change with the environment. For example if you are mocking an API to have your application locally you would use a URL like `http://localhost:3000/mock/api` but in production or QA environments you would have it something like `http://qa.app.com/api` or `http://prod.app.com/api`. In order to prevent any kind of hard coding in the application files we do the following.

## Common Environment File
`./src/environments/environment.js` is the common environment file that will be referenced accorss the application. This file would contain all the variables that would be needed in the application. For example

```js
// Example
// ./src/environments/environment.js
// The common environment file typically contains mocked URL's for local builds
export const footerApi = 'http://localhost:3000/mock/apiOne';
export const footerNewsletterApi = 'http://localhost:3000/mock/apiTwo';
export const headerApi = 'http://localhost:3000/mock/apiThree';
```

```js
// Component file
// ./src/modules/footer/footer.component.js

import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
// Import relative to the component file.
// NOTE: You should always import the common environment file `environment.js`.
// Webpack replaces this at build time with the environment based file.
import { footerApi, footerNewsletterApi } from '@academysports/aso-env';
import './footer.component.scss';

...
class Footer extends React.PureComponent {
  static getInitialProps() {
    return axios.get(footerApi);
  }
  ...
}

```

## Envorinment Specific Files
Say that you want to have a different set of URL's from what you test locally for the dev environment. You would need to do the following.

1. Create a file `environment.<environment alias>.js`
    - **NOTE:** If your environment is `development` then your alias would be `dev` and hence your file name would be `environment.dev.js`
2. Copy the contents of `environment.js` to the new file.
3. Override the values of the variables.

**REMEMBER:** Keep your environement files in sync i.e. if you have created and exported a variable in your common file that same variable should be present and exported in the environment specific files.

So if we take the above `environment.js` file as an example. A sample file for `development` environment would be `environment.dev.js`. And its contents would be something as follows.

```js
// Example
// ./src/environments/environment.dev.js
export const footerApi = 'http://dev.application.com/apiOne';
export const footerNewsletterApi = 'http://dev.application.com/apiTwo';
export const headerApi = 'http://dev.application.com/apiThree';
```

## Environment Specific Builds
At this point you will be wondering how come we are not changing the component files to reflect the environment based imports for the configuration. This is where webpack and some CLI magic comes into play.

So if you want to build your components/application out for `development` environment where `dev` is the alias and the associated config file name is `environment.dev.js`, you would simply run: 

```
npm run build -- -e=dev
```

This command would replace the imported file from `environment.js` wherever used to `environment.dev.js`.

For local builds you would still default to `environment.js` file which can be run using the same old build command.

```
npm run build
```

## Build With Fractal
Fractal build doesn't requrie any major change as well. So if you want to build your components/application out for `development` environment where `dev` is the alias and the associated config file name is `environment.dev.js`, you would simply run: 

```
npm run fractal -- -e=dev
```
or for local
```
npm run fractal
```

All the other flags would still work the same as before.

## Tree-Shaking
Since we are building using webpack, it helps to auto-magically achieve tree-shaking and removes dead-code and unused variables. So if we take the above example, even though `environment.js` is exporting **three** varables, `footer.component.js` is only importing **two** (`footerApi`, `footerNewsletterApi`) from it. So only those **two** will be available in the final build, thus reducing the overall bundle size.