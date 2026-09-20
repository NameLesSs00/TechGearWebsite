okay now we will work on the card for the prodcuts here is an example image 
and here is the data for each prodcut 
 "id": "47cec0e5-ffef-41eb-8989-a6f8b0b8eb5d",
        "iconImageUrl": "/uploads/products/aaa4d620008e41f3b7fba89ac3646f96.svg",
        "heroImageUrl": "/uploads/products/dec7fa1df955408f9409f79fd1e36193.png",
        "productLink": "linkGeat/test",
        "createdAt": "2026-09-20T10:49:34.5982251+00:00",
        "updatedAt": null,
        "name": "string",
        "resolvedLanguage": "en"
we should be shwoing hte heroImage as the main image of the prodcut and the iconImage this si the image that will be display in the top right 
prodcut link is the link that the button will use 
and the name is the title of the prodcut the test of the data will not be shown also note that 
there is no page for the single prodcut we should just go to the prodct page if we have a prodcut for it 
that's it create a plan so that we can have this UI and also here is all of the new endpoints for the single prodcut 
create a plan so that we could make sure the data is right in the UI and also to implment those new endpoint right in the app you could make the plan have 2 parts one for the backend and the other is for the front 
Product


GET
/api/products


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
  'https://tech-gear-backend-site.premiumasp.net/api/products?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiI3N2RlZGZlOC04YTNmLTRjMDEtYTNjZS1jYTBiNGViMjQzZGQiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5OTA1MDQ3LCJleHAiOjE3ODk5OTE0NDcsImlhdCI6MTc4OTkwNTA0NywiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.gLJfzkp_CHHHxScSGaKGLKcTs4Q1GxO76C_3uIiQEVs'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/products?page=1&pageSize=20
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
        "id": "47cec0e5-ffef-41eb-8989-a6f8b0b8eb5d",
        "iconImageUrl": "/uploads/products/aaa4d620008e41f3b7fba89ac3646f96.svg",
        "heroImageUrl": "/uploads/products/dec7fa1df955408f9409f79fd1e36193.png",
        "productLink": "linkGeat/test",
        "createdAt": "2026-09-20T10:49:34.5982251+00:00",
        "updatedAt": null,
        "name": "string",
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
 date: Sun,20 Sep 2026 12:55:23 GMT 
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
        "iconImageUrl": "string",
        "heroImageUrl": "string",
        "productLink": "string",
        "createdAt": "2026-09-20T12:57:59.192Z",
        "updatedAt": "2026-09-20T12:57:59.192Z",
        "name": "string",
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
/api/products


Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
IconImage
string($binary)
No file chosen
Send empty value
HeroImage
string($binary)
No file chosen
Send empty value
ProductLink
string
string
Send empty value
Translations
array
{
  "languageCode": "string",
  "name": "string"
}
-
{
  "languageCode": "ar",
  "name": "string"
}
-
Add object item
Send empty value
Execute
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
/api/products/{id}


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
    "iconImageUrl": "string",
    "heroImageUrl": "string",
    "productLink": "string",
    "createdAt": "2026-09-20T12:57:59.199Z",
    "updatedAt": "2026-09-20T12:57:59.199Z",
    "name": "string",
    "resolvedLanguage": "string"
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/products/{id}


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
IconImage
string($binary)
HeroImage
string($binary)
ProductLink
string
Translations
array
Responses
Code	Description	Links
200	
OK

No links

DELETE
/api/products/{id}


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