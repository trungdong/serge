export default {
  "type": "object",
  "properties": {
    "TurnNumber": {
      "title": "Turn",
      "type": "string",
      "format": "number"
    },
    "Summary": {
      "title": "Summary",
      "type": "string",
      "format": "textarea"
    },
    "ForceDisposition": {
      "title": "Force disposition",
      "type": "string",
      "format": "url"
    },
    "Narrative": {
      "items": {
        "properties": {
          "Serial": {
            "title": "Serial",
            "type": "string",
            "format": "text"
          },
          "Description": {
            "title": "Description",
            "type": "string",
            "format": "textarea"
          }
        },
        "title": "Events",
        "type": "object"
      },
      "title": "Narrative",
      "type": "array",
      "format": "table",
      "minItems": 1
    }
  },
  "title": "State of World 2",
  "required": [
    "TurnNumber",
    "Summary",
    "ForceDisposition",
    "Narrative"
  ]
}
