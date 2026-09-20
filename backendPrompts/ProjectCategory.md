here we have the catageory for the project we work on please make sure we add it to teh servers we use or hooks also note that this should be fetch only once when the client open the app and will be sotred in the cash and if we don't have any that is a problem but anyways we need to do that as we will felter using those later so could you create a full plan so that we add all of those so that later when we add the admin dashboard we could use all of those endpoints ?
ProjectCategory


GET
/api/project-categories


Parameters
Cancel
Name	Description
language
string
(query)
language
page
integer($int32)
(query)
1
pageSize
integer($int32)
(query)
100
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://tech-gear-backend-site.premiumasp.net/api/project-categories?page=1&pageSize=100' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiI4OWQyMjRlNy0zN2VkLTQ3ODYtYWI5Zi02YTZhNzhlMzk3YzIiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODk2NjcwLCJleHAiOjE3ODk5ODMwNzAsImlhdCI6MTc4OTg5NjY3MCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.fW8oR6XoRUTFI637NNnZcB85ADViJGVaxSc9D_07wbw'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/project-categories?page=1&pageSize=100
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1ceafe55-b794-44a2-a5e7-3a20d85fde9c",
        "name": "Website",
        "resolvedLanguage": "en",
        "createdAt": "2026-09-20T09:32:59.4795882+00:00",
        "updatedAt": null
      }
    ],
    "page": 1,
    "pageSize": 100,
    "totalCount": 1,
    "totalPages": 1
  },
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sun,20 Sep 2026 09:33:03 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "resolvedLanguage": "string",
        "createdAt": "2026-09-20T09:33:50.958Z",
        "updatedAt": "2026-09-20T09:33:50.958Z"
      }
    ],
    "page": 0,
    "pageSize": 0,
    "totalCount": 0,
    "totalPages": 0
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

POST
/api/project-categories


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "translations": [
    {
      "languageCode": "en",
      "name": "Website"
    },{
      "languageCode": "ar",
      "name": "موقع الكتروني"
    }
  ]
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://tech-gear-backend-site.premiumasp.net/api/project-categories' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiI4OWQyMjRlNy0zN2VkLTQ3ODYtYWI5Zi02YTZhNzhlMzk3YzIiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODk2NjcwLCJleHAiOjE3ODk5ODMwNzAsImlhdCI6MTc4OTg5NjY3MCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.fW8oR6XoRUTFI637NNnZcB85ADViJGVaxSc9D_07wbw' \
  -H 'Content-Type: application/json' \
  -d '{
  "translations": [
    {
      "languageCode": "en",
      "name": "Website"
    },{
      "languageCode": "ar",
      "name": "موقع الكتروني"
    }
  ]
}'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/project-categories
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "success": true,
  "data": "1ceafe55-b794-44a2-a5e7-3a20d85fde9c",
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sun,20 Sep 2026 09:32:59 GMT 
 location: https://tech-gear-backend-site.premiumasp.net/api/project-categories/1ceafe55-b794-44a2-a5e7-3a20d85fde9c 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

GET
/api/project-categories/{id}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
language
string
(query)
language
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "resolvedLanguage": "string",
    "createdAt": "2026-09-20T09:33:50.965Z",
    "updatedAt": "2026-09-20T09:33:50.965Z"
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/project-categories/{id}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
Request body

application/json
Example Value
Schema
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "translations": [
    {
      "languageCode": "string",
      "name": "string"
    }
  ]
}
Responses
Code	Description	Links
200	
OK

No links

DELETE
/api/project-categories/{id}


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
id
Execute
Responses
Code	Description	Links
200	
OK