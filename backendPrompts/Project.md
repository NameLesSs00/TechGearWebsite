those are the new data for the projects after you implment them in the app I'll tell you how the UI should look like but we should first make sure the interfaces and the things are looking great could you create a plan so that we have all of the endpoint in the app with the right data as we have upadted the backend ?
i will tell you how to use those data
in the card for the prodcut we will show the heroImageUrl and the title for it and the category name and the description for it for the rest of the data i'll tell you what we will do with it but in the single project page okay now create a plan to do all of those 
Project


GET
/api/projects


Parameters
Cancel
Name	Description
language
string
(query)
en
categoryId
string($uuid)
(query)
categoryId
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
  'https://tech-gear-backend-site.premiumasp.net/api/projects?language=en&page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiI3N2RlZGZlOC04YTNmLTRjMDEtYTNjZS1jYTBiNGViMjQzZGQiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5OTA1MDQ3LCJleHAiOjE3ODk5OTE0NDcsImlhdCI6MTc4OTkwNTA0NywiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.gLJfzkp_CHHHxScSGaKGLKcTs4Q1GxO76C_3uIiQEVs'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/projects?language=en&page=1&pageSize=20
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
        "id": "ab3d837f-12cf-44bd-9c9a-b53d83eb5a32",
        "categoryId": "1ceafe55-b794-44a2-a5e7-3a20d85fde9c",
        "categoryName": "Website",
        "iconImageUrl": "/uploads/projects/9749263937754a20a24a0e9fd20ff4dc.svg",
        "heroImageUrl": "/uploads/projects/40c74ce917a1404b9765840c92a05fd5.jfif",
        "projectLink": "ffd/gfdfgd",
        "featuredImageUrl": "/uploads/projects/9791caab8f1c465c842d823aea0f468c.jpg",
        "images": [
          {
            "id": "8153f1d2-f372-47b7-93f8-cc4329f27167",
            "imageUrl": "/uploads/projects/9791caab8f1c465c842d823aea0f468c.jpg",
            "isFeatured": true,
            "displayOrder": 0
          },
          {
            "id": "53e6f72e-616a-4b89-8a4a-d88937aed9c5",
            "imageUrl": "/uploads/projects/5822152cabd54455ad718efd022d2b45.jpg",
            "isFeatured": false,
            "displayOrder": 1
          }
        ],
        "createdAt": "2026-09-20T11:52:42.84209+00:00",
        "updatedAt": null,
        "title": "fgf",
        "description": "gfdf",
        "industry": "string",
        "projectType": "string",
        "services": "string",
        "platform": "string",
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
 date: Sun,20 Sep 2026 13:27:10 GMT 
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
        "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "categoryName": "string",
        "iconImageUrl": "string",
        "heroImageUrl": "string",
        "projectLink": "string",
        "featuredImageUrl": "string",
        "images": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "imageUrl": "string",
            "isFeatured": true,
            "displayOrder": 0
          }
        ],
        "createdAt": "2026-09-20T13:27:18.902Z",
        "updatedAt": "2026-09-20T13:27:18.902Z",
        "title": "string",
        "description": "string",
        "industry": "string",
        "projectType": "string",
        "services": "string",
        "platform": "string",
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
/api/projects


Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
CategoryId
string($uuid)
1ceafe55-b794-44a2-a5e7-3a20d85fde9c
Send empty value
IconImage
string($binary)
No file chosen
Send empty value
HeroImage
string($binary)
No file chosen
Send empty value
ProjectLink
string
ffd/gfdfgd
Send empty value
Images
array
No file chosen-
No file chosen-
Add string item
Send empty value
Translations
array
{
  "languageCode": "en",
  "title": "fgf",
  "description": "gfdf",
  "industry": "string",
  "projectType": "string",
  "services": "string",
  "platform": "string"
}
-
{
  "languageCode": "ar",
  "title": "لبتيللاتبيللا",
  "description": "gfdf",
  "industry": "string",
  "projectType": "string",
  "services": "string",
  "platform": "string"
}
-
Add object item
Send empty value
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://tech-gear-backend-site.premiumasp.net/api/projects' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiI3N2RlZGZlOC04YTNmLTRjMDEtYTNjZS1jYTBiNGViMjQzZGQiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5OTA1MDQ3LCJleHAiOjE3ODk5OTE0NDcsImlhdCI6MTc4OTkwNTA0NywiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.gLJfzkp_CHHHxScSGaKGLKcTs4Q1GxO76C_3uIiQEVs' \
  -H 'Content-Type: multipart/form-data' \
  -F 'CategoryId=1ceafe55-b794-44a2-a5e7-3a20d85fde9c' \
  -F 'IconImage=@Layer 1.svg;type=image/svg+xml' \
  -F 'HeroImage=@Gemini_Generated_Image_cinjhacinjhacinj.jfif;type=image/jpeg' \
  -F 'ProjectLink=ffd/gfdfgd' \
  -F 'Images=@59.jpg;type=image/jpeg' \
  -F 'Images=@download-53.jpg;type=image/jpeg' \
  -F 'Translations={
  "languageCode": "en",
  "title": "fgf",
  "description": "gfdf",
  "industry": "string",
  "projectType": "string",
  "services": "string",
  "platform": "string"
}' \
  -F 'Translations={
  "languageCode": "ar",
  "title": "لبتيللاتبيللا",
  "description": "gfdf",
  "industry": "string",
  "projectType": "string",
  "services": "string",
  "platform": "string"
}'
Request URL
https://tech-gear-backend-site.premiumasp.net/api/projects
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "success": true,
  "data": "ab3d837f-12cf-44bd-9c9a-b53d83eb5a32",
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sun,20 Sep 2026 11:52:42 GMT 
 location: https://tech-gear-backend-site.premiumasp.net/api/projects/ab3d837f-12cf-44bd-9c9a-b53d83eb5a32 
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
/api/projects/{id}


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
    "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "categoryName": "string",
    "iconImageUrl": "string",
    "heroImageUrl": "string",
    "projectLink": "string",
    "featuredImageUrl": "string",
    "images": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "imageUrl": "string",
        "isFeatured": true,
        "displayOrder": 0
      }
    ],
    "createdAt": "2026-09-20T13:27:18.912Z",
    "updatedAt": "2026-09-20T13:27:18.912Z",
    "title": "string",
    "description": "string",
    "industry": "string",
    "projectType": "string",
    "services": "string",
    "platform": "string",
    "resolvedLanguage": "string"
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/projects/{id}


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
CategoryId
string($uuid)
IconImage
string($binary)
HeroImage
string($binary)
ProjectLink
string
Images
array
Translations
array
Responses
Code	Description	Links
200	
OK

No links

DELETE
/api/projects/{id}


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