here is the updated code for the reivews those are the endpoints as you can see here the reviews that are in the homepage are missing some data so please make sure when we show it we should it right 
create a full plan so that we use that data right but i don't create about the homepage now we should create the admin pages for them first so the first task for you is to create the admin page for the reviews could you create a plan for it .
Review


GET
/api/reviews


Parameters
Try it out
Name	Description
language
string
(query)
language
page
integer($int32)
(query)
Default value : 1

1
pageSize
integer($int32)
(query)
Default value : 20

20
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
        "clientName": "string",
        "videoUrl": "string",
        "stars": 0,
        "client_image": "string",
        "hero_image": "string",
        "icon_image": "string",
        "createdAt": "2026-09-23T14:56:03.939Z",
        "updatedAt": "2026-09-23T14:56:03.939Z",
        "reviewContent": "string",
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
/api/reviews


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "clientName": "string",
  "videoUrl": "string",
  "stars": 0,
  "translations": [
    {
      "languageCode": "string",
      "reviewContent": "string"
    }
  ]
}
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
/api/reviews/{id}


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
    "clientName": "string",
    "videoUrl": "string",
    "stars": 0,
    "client_image": "string",
    "hero_image": "string",
    "icon_image": "string",
    "createdAt": "2026-09-23T14:56:03.944Z",
    "updatedAt": "2026-09-23T14:56:03.944Z",
    "reviewContent": "string",
    "resolvedLanguage": "string"
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/reviews/{id}


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
  "clientName": "string",
  "videoUrl": "string",
  "stars": 0,
  "translations": [
    {
      "languageCode": "string",
      "reviewContent": "string"
    }
  ]
}
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
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

DELETE
/api/reviews/{id}


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

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/reviews/{id}/images/client


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
Request body

multipart/form-data
Image
string($binary)
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
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

DELETE
/api/reviews/{id}/images/client


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

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/reviews/{id}/images/hero


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
Request body

multipart/form-data
Image
string($binary)
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
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

DELETE
/api/reviews/{id}/images/hero


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

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/reviews/{id}/images/icon


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
Request body

multipart/form-data
Image
string($binary)
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
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

DELETE
/api/reviews/{id}/images/icon


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

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}