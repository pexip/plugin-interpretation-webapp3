# State notification

Each **interpreter** will notify his state to the rest of the participants through application messages. The Interpreter will send a JSON message with the following format:

```json
{
  "participantUuid": <participantUuid>,
  "role": "interpreter",
  "language": <languageCode> | null
}
```

This message will be sent in the following circumstances:

- When the Interpreter joins a interpretation room.
- When a new participant joins.
- When the Interpreter leaves the interpretation room.
- When the Interpreter changes to another interpretation room.