now we need to create a plan so that we add those endpoints to the app and make sure we add all of hte funtions right as we will alter use them for the admin page could you create a full plan so that we enter them right also the data for the ImageUrl is not impornat at all and we will ignore it we could just send it as string from now one later in the admin could you now create a plan so that we fetch it from hte database and reomve all of the dummy data from teh app ? create a full plan for that and when there are not data at all in the journy we don't show an erorr but say that there is no curent data okay now create a full plan 
Journey


GET
/api/journeys


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
20
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://tech-gear-backend-site.premiumasp.net/api/journeys?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiIyYjEzNGI2ZS1iZjE4LTQ5YWMtYTdhYy04YTgwZmYwYmRjMTIiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzkwMTY5MTc0LCJleHAiOjE3OTAyNTU1NzQsImlhdCI6MTc5MDE2OTE3NCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.z90iMsSudb3WuMDzpaXcPVugAwegjcXsDCM2TaNq0d0'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/journeys?page=1&pageSize=20
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
        "id": "298adc25-36c7-4403-917c-1a6f6ea579e9",
        "yearOrDate": "2005-01-01",
        "imageUrl": "/uploads/journeys/6530783aa8d64b3eb652ec05ceea1ba1.png",
        "displayOrder": 1,
        "createdAt": "2026-09-23T13:13:12.9306199+00:00",
        "updatedAt": null,
        "title": "test",
        "description": "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring",
        "resolvedLanguage": "en"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 1,
    "totalPages": 1
  },
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,23 Sep 2026 13:13:18 GMT 
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
        "yearOrDate": "string",
        "imageUrl": "string",
        "displayOrder": 0,
        "createdAt": "2026-09-23T13:13:18.565Z",
        "updatedAt": "2026-09-23T13:13:18.565Z",
        "title": "string",
        "description": "string",
        "resolvedLanguage": "string"
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
/api/journeys


Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
YearOrDate
string
2005
Send empty value
Image
string($binary)
Frame 1171276633 (1).png
Send empty value
ImageUrl
string
string
Send empty value
DisplayOrder
integer($int32)
1
Send empty value
Translations
array
{
  "languageCode": "en",
  "title": "test",
  "description": "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring"
}
-
{
  "languageCode": "ar",
  "title": "test",
  "description": "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring"
}
-
Add object item
Send empty value
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://tech-gear-backend-site.premiumasp.net/api/journeys' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiIyYjEzNGI2ZS1iZjE4LTQ5YWMtYTdhYy04YTgwZmYwYmRjMTIiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzkwMTY5MTc0LCJleHAiOjE3OTAyNTU1NzQsImlhdCI6MTc5MDE2OTE3NCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.z90iMsSudb3WuMDzpaXcPVugAwegjcXsDCM2TaNq0d0' \
  -H 'Content-Type: multipart/form-data' \
  -F 'YearOrDate=2005' \
  -F 'Image=@Frame 1171276633 (1).png;type=image/png' \
  -F 'ImageUrl=string' \
  -F 'DisplayOrder=1' \
  -F 'Translations={
  "languageCode": "en",
  "title": "test",
  "description": "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring"
}' \
  -F 'Translations={
  "languageCode": "ar",
  "title": "test",
  "description": "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring"
}'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/journeys
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "success": true,
  "data": "298adc25-36c7-4403-917c-1a6f6ea579e9",
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,23 Sep 2026 13:13:13 GMT 
 location: https://tech-gear-backend-site.premiumasp.net/api/journeys/298adc25-36c7-4403-917c-1a6f6ea579e9 
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
/api/journeys/{id}


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
    "yearOrDate": "string",
    "imageUrl": "string",
    "displayOrder": 0,
    "createdAt": "2026-09-23T13:13:18.573Z",
    "updatedAt": "2026-09-23T13:13:18.573Z",
    "title": "string",
    "description": "string",
    "resolvedLanguage": "string"
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/journeys/{id}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
Request body

multipart/form-data
Id
string($uuid)
YearOrDate
string
Image
string($binary)
ImageUrl
string
DisplayOrder
integer($int32)
Translations
array
Responses
Code	Description	Links
200	
OK

No links

DELETE
/api/journeys/{id}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
Responses
Code	Description	Links
200	
OK