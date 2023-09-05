# Interpretation plugin Web App 3

This plugin replicates the behavior of the [Web App 2 plugin](https://github.com/pexip/plugin-interpretation) for interpretation, but it uses the new Web App 3 plugin system and the React components.

This plugin should be deployed in the **same domain** as Web App 3 and for this reason we have some additional steps to test it in a local environment.

In the plugin we have two roles that have to be deployed in two different brandings:

- **Interpreter:** User that translate what the people is saying in the main room.
- **Listener:** User that can join to the interpretation room and listen to what the interpreter is saying.

## Deploy a Web App branding for development

The first step is to deploy a two brandings in Infinity that we will use for testing each one of these roles.

For the brandings we will use the following parameters:

### Interpreter

- **Port:** 5173
- **Branding path:** /interpreter

### Listener

- **Port:** 5174
- **Branding path:** /listener

This way, one branding will read a plugin from `http://localhost:5173` (interpreter) and the other from the address `http://localhost:5174` (listener), so we don't need to upload the plugin every time we want to test it and we can test both roles at the same time.

To keep it easy, you will find the both brandings in the folder `dev-branding` of this project.

The steps to install the interpreter branding are the following:

- Compress the folder `dev-branding/interpreter/webapp3` in a file called `webapp3.zip`.
- Open the Infinity Management node interface and upload the new branding: `Web App > Web App Branding`. You can call this new branding `interpreter`.
- Create a path that points to the new branding: `Web App > Web App Paths`. The path to the branding must be `interpreter`.

Now you have to repeat the same process for the `listener`.

## Run for development

Once the branding is deployed we need to configure some parameters: 

- Edit `vite.json` with your environment parameters. You only have to modify the `infinityUrl` parameter with the URL of your Infinity deployment:

```json
{
  "infinityUrl": "https://192.168.1.101",
  "interpreter": {
    "port": 5173,
    "brandingPath": "/interpreter",
    "publicDir": "./public"
  },
  "listener": {
    "port": 5174,
    "brandingPath": "/listener",
    "publicDir": "./dev-public/listener"
  }
}
```

- Install all the dependencies:

```bash
$ npm i
```

- Run the dev environment:

```bash
$ npm run interpreter
```

or 

```bash
$ npm run listener
```

## Configure local policy

An easy way to test the plugin is to use a local policy. In this case we designed a local policy for testing. It will allow every VMR with 2 or 6 digits and will use the pins 1234 for the hosts and 4321 for the guests.

```python
{
  {% if (call_info.local_alias | pex_regex_replace('^(\d{2}|\d{6})$',  '') == '')  %}
    "action": "continue",
    "result": {
        "service_type": "conference",
        "name": "{{call_info.local_alias}}",
        "service_tag": "pexip-interpreter",
        "description": "",
        "call_tag": "",
        "pin": "1234",
        "guest_pin": "4321",
        "guests_can_present": true,
        "allow_guests": true,
        "view": "four_mains_zero_pips",
        "ivr_theme_name": "visitor_normal",
        "locked": false,
        "automatic_participants": []
     }
  {% elif service_config %}
    {
      "action" : "continue",
      "result" : {{service_config | pex_to_json}}
    }
  {% else %}
    {
      "action" : "reject",
      "result" : {}
    }
  {% endif %}
}
```

## Build for production

To create a package you need to install first all the dependencies:

```bash
$ npm i
```

And now to create the package itself:

```bash
$ npm run build
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