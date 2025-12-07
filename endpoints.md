Events Endpoints
Create Event
Path: /api/events
Method: POST
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
Content-Type: application/json
CORS: Enabled
Expected Body: Event details (based on your schema)
Get All Events
Path: /api/events
Method: GET
Auth: None (Public)
CORS: Enabled
Query Parameters: (if any defined in implementation)
Get Event by ID
Path: /api/events/{eventId}
Method: GET
Auth: None (Public)
CORS: Enabled
Parameters:
eventId (path parameter)
Register for Event
Path: /api/events/{eventId}/register
Method: POST
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Parameters:
eventId (path parameter)
Unregister from Event
Path: /api/events/{eventId}/unregister
Method: POST
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Parameters:
eventId (path parameter)
Search Endpoints
Search Events
Path: /search/events
Method: GET
Auth: None (Public)
CORS: Enabled
Query Parameters: (search terms as defined in implementation)
User Endpoints
Get User Events
Path: /api/user/events
Method: GET
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Get User Profile
Path: /api/user/profile
Method: GET
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Coach Endpoints
Get Coach Profile
Path: /api/coach/profile
Method: GET
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Update Coach Profile
Path: /api/coach/profile
Method: PUT
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
Content-Type: application/json
CORS: Enabled
Expected Body: Coach profile details
Upload Endpoints
Get Event Image Upload URL
Path: /api/upload/event-image
Method: POST
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Delete Event Image
Path: /api/upload/event-image
Method: DELETE
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Get Profile Image Upload URL
Path: /api/upload/profile-image
Method: POST
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled
Delete Profile Image
Path: /api/upload/profile-image
Method: DELETE
Auth: Required (Cognito)
Headers:
Authorization: Bearer token (required)
CORS: Enabled


endpoints:
  POST - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/events
  GET - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/events
  GET - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/events/{eventId}
  POST - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/events/{eventId}/register
  POST - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/events/{eventId}/unregister
  GET - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/search/events
  GET - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/user/events
  GET - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/user/profile
  GET - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/coach/profile
  PUT - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/coach/profile
  POST - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/upload/event-image
  DELETE - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/upload/event-image
  POST - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/upload/profile-image
  DELETE - https://7frpbc7aa5.execute-api.eu-central-1.amazonaws.com/dev/api/upload/profile-image