# Event Processing

### Installing:

```sh
> git clone git@github.com:unity/event-attribution.git;
> cd event-attribution;
```

### Booting

```sh
> yarn # (or npm i)
> yarn dev # (or npm run dev)
```

### Developing:

```sh
> yarn dev
# {"port":8082,"level":"info","message":"connector.server.listen"}
# In a new shell
> yarn ngrok
# listening on https://hull-eventprocessor.eu.ngrok.io
# Go to your dashboard, and add this connector.
```

### Testing

```sh
> yarn test
# or
> yarn test:watch # to keep it watching.
```
