<p align="center">
    <img src="images/logo.png" alt="Manifest" title="Manifest">
</p>

<p align="center">
    <a href="#">
        <img src="https://img.shields.io/badge/Created for-Node.js-teal.svg?style=flat">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/Written in-TypeScript-purple.svg?style=flat">
    </a>
    <a href="https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)">
        <img src="https://img.shields.io/badge/License-Apache 2.0-blue.svg?style=flat">
    </a>
</p>

## At a Glance

`Manifest` is a framework that takes control over Node.js app using a single configuration file. `Manifest` includes `Express` framework and `Handlebars` server-side rendering under the hood.

## How to Get Started

Type in Terminal:

```
npm install --save @simplisticated/manifest express hbs express-hbs
npm install --save-dev @types/express @types/hbs
```

or, if you prefer `yarn` over `npm`, type:

```
yarn add @simplisticated/manifest express hbs express-hbs
yarn add @types/express @types/hbs --dev
```

## Requirements

- [express](https://expressjs.com)
- [hbs](https://www.npmjs.com/package/hbs)
- [express-hbs](https://www.npmjs.com/package/express-hbs)

## Usage

### Launching App

The simplest way to start Express server:

```typescript
import * as mfst from "@simplisticated/manifest";

mfst.App.create().start();
```

Open [localhost:3000](http://localhost:3000) in your browser. You will see a message saying `Built with Manifest framework`.

That's all! The server is launched 🚀

By the way, you can access `Express` instance directly by calling

```typescript
app.expressInstance
```

Quite simple, right? 😉

### Server Configuration

Now let's learn how to configure our server:

```typescript
import * as mfst from "@simplisticated/manifest";

let app = mfst.App.create({
    server: {
        port: 3000,          // Use any port, usually it's 3000
        secure: false       // HTTP or HTTPS
    },
    api: {
        routes: [
            {
                url: `/`,
                methods: {
                    get: {
                        text: `<h1>This page is under construction</h1>`,
                    }
                }
            },
            {
                url: "/users",
                    methods: {
                        get: {
                            json: {
                                count: 200,
                                users: [
                                    {
                                        id: 1,
                                        first_name: "John",
                                        last_name: "Appleseed"
                                    },
                                    // etc...
                                ]
                            }
                        },
                        post: {
                            handler: (req, res) => {
                                const { first_name, last_name } = req.body;
                                
                                if (first_name && last_name) {
                                    // Create user in database...
                                    return {
                                        json: {
                                            id: 123,
                                            first_name,
                                            last_name
                                        },
                                        status: 200
                                    };
                                } else {
                                    return {
                                        json: {
                                            message: "Please make sure that you send first_name and last_name parameters."
                                        },
                                        status: 400
                                    };
                                }
                            }
                        }
                    }
                },
            {
                url: `*`,
                methods: {
                    get: {
                        text: `<h1>Page not found</h1>`,
                        status: 404,
                        timeout: 2000
                    }
                }
            }
        ],
    }
});

app.start();
```

In the above example you can see a very simple configuration that is enough to launch a primitive server which will be able to respond to HTTP requests.

### Manifest Sections

#### `server.port`

Port number that server will be listen to.

#### `server.secure`

If `true`, HTTPS will be used under the hood. Otherwise, we'll use unsecure HTTP.

#### `server.corsBlocked`

If `true`, CORS will be enabled for all endpoints.

#### `api.requestHandlers`

Array of functions. Each function has `request` parameter and handles request before it's processed by `Manifest` framework. You can use handlers for any purpose. For example, sending request information to the console output:

```typescript
requestHandlers: [
    (request) => {
        console.log(`Request to ${request.url}`);
    }
]
```

#### `api.routes`

Array of objects. Each object represents a different route. Example:

```typescript
{
    routes: [
        {
            url: "/",
            methods: {
                get: {
                    text: "Hello!"
                },
                post: {
                    text: "Post response."
                },
                put: {
                    text: "Put response."
                },
                delete: {
                    text: "Delete response."
                }
            }
        }
    ]
}
```

The `methods` object can include any of these HTTP methods:

- `get`
- `post`
- `put`
- `delete`

Each HTTP method describes the response to client's request. `Manifest` supports 5 types of response:

- Text (returns simple text)
- JSON (returns JSON object or array)
- Page (returns page and data for server-side rendering)
- Redirect (sends command for redirection to another URL)
- Custom (arrow function that is implemented by developer and returns text or JSON or page response)
- Custom asynchronous (arrow function that is implemented by developer and returns text or JSON or page response by using callback)

Example of text response:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    text: "<h1>John Green</h1>"
                }
            }
        }
    ]
}
```

JSON response:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    json: {
                        first_name: "John",
                        last_name: "Green"
                    }
                }
            }
        }
    ]
}
```

Page response:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    path: `${__dirname}/views/profile.hbs`,
                    data: {
                        // Optional data that will be used by Handlebars engine.
                        firstName: "John",
                        lastName: "Green"
                    }
                }
            }
        }
    ]
}
```

Redirect response:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    redirectTo: "/not_found"
                }
            }
        }
    ]
}
```

Custom response:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    handler: (request, response) => {
                        let firstName = "John";
                        let lastName = "Green";

                        // We have to return text or JSON or page response here.
                        return {
                            json: {
                                first_name: firstName,
                                last_name: lastName
                            }
                        };
                    }
                }
            }
        }
    ]
}
```

Custom asynchronous response:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    asyncHandler: (request, response, callback) => {
                        let firstName = "John";
                        let lastName = "Green";
                        
                        // Return response using callback.
                        callback({
                            json: {
                                first_name: firstName,
                                last_name: lastName
                            }
                        });
                    }
                }
            }
        }
    ]
}
```

Also, most of response types support optional parameters:

- `status`: HTTP status, by default 200
- `delay`: The duration in milliseconds of delay before returning response.

Example of using custom HTTP status:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    text: "<h1>Not found</h1>",
                    status: 404
                }
            }
        }
    ]
}
```

Sometimes you might want to simulate slow server. Use `delay` for this purpose:

```typescript
{
    routes: [
        {
            url: `/profile`,
            methods: {
                get: {
                    json: {
                        first_name: "John",
                        last_name: "Green"
                    },
                    delay: 4000
                }
            }
        }
    ]
}
```

#### `server.viewEngines.current`

The current view engine. Currently supports `handlebars` only. Possible values:

* `handlebars`
* `none`

#### `server.viewEngines.partialsDirectory`

Path to partials directory for the view engine.

## License

`Manifest` is available under the Apache 2.0 license. See the [LICENSE](./LICENSE) file for more info.
