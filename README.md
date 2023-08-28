# Interpretation plugin Web App 3

This plugin replicates the behavior of the [Web App 2 plugin](https://github.com/pexip/plugin-interpretation) for interpretation, but it uses the new Web App 3 plugin system and the React components.

This plugin should be deployed in the **same domain** as Web App 3 and for this reason we have some additional steps to test it in a local environment.

## Deploy a Web App branding

The first step is to deploy a branding in Infinity. This branding will allow us to read the plugin from `http://localhost:5173`, so we don't need to upload the plugin every time we want to test it.

To keep it easy, you will find the branding in the folder `dev-branding` of this project.

The steps to install the branding are the following:

- Compress the folder `webapp3` in a file called `webapp3.zip`.
- Open the Infinity Management node interface and upload the new branding: `Web App > Web App Branding`.
- Create a path that points to the new branding: `Web App > Web App Paths`. For example, it could be `local-plugin`.

## Run for development

Once the branding is deployed we need to configure some parameters: 

- Edit `vite.json` with your environment parameters:

```json
{
  "infinityUrl": "https://192.168.1.101",
  "brandingPath": "/local-plugin"
}
```

- Install all the dependencies:

```bash
$ yarn
```

- Run the dev environment:

```bash
$ yarn start
```

## Build for production

To create a package you need to install first all the dependencies:

```bash
$ yarn
```

And now to create the package itself:

```bash
$ yarn build
```

Congrats! Your package is ready and it will be available in the `dist` folder.

## Configure the plugin

The plugin has a config file (`config.json`) that drives how the plugin behaves.

Here is an example of configuration:

```json
{
  "role": "interpreter",
  "languages": [
    {
      "code": "0033",
      "name": "french"
    },
    {
      "code": "0034",
      "name": "spanish"
    }
  ]
}
```

| Parameter | Description |
|-----------|-------------|
| role | Indicates the role of the user that joins to the interpretation. We have two different roles: `interpreter` and `listener`.
| languages | The list of all the available languages. Each language will have two values: `code` and `name`. The `code` is the subfix that will be attached to the conference name. For example, if for the main conference we have `conferenceAlias=123` and `code=0033`, the system will create a new audio conference with `conferenceAlias=1230033`. The `name` is used for the UI elements, such as selectors.