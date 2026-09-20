okay we need to create a plan so that we have those implmneted in the app i don't want them to be linked in the fontend yet i just want it to be added so that the app new data could be shown right i have added new thing and here are thier explanatoin
the iconImageUrl is the icons we put in the card in the homepage , serviceImageUrl is the image we show in the service , title is in the card , subtitle amd description is in the page where we show the dealties of the servier ,whatWeDeliver is the list of things we deliver , the features are the icons we show in the bottom of the servier could you create a full plan so that we have everything ready to be added right in the app  note that in the services folder we will edit the  serviceService.ts so that we will be able to use all of those endpoints and later we will link them to the UI could you create a plan for those ?
Service


GET
/api/services


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
  'http://localhost:5069/api/services?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I'
Request URL
http://localhost:5069/api/services?page=1&pageSize=20
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
        "id": "2051599d-bdd8-40d2-b1a4-2edea378b2e5",
        "iconImageUrl": null,
        "serviceImageUrl": "/uploads/services/b5f8b0ba7601486fbf746fd453bf7857.png",
        "title": "Full-Stack Web Development",
        "subtitle": "End-to-End Scalable Solutions",
        "description": "Enterprise web applications using modern stacks.",
        "whatWeDeliver": [],
        "features": [],
        "createdAt": "2026-09-01T11:47:55.2022878+00:00",
        "updatedAt": null,
        "resolvedLanguage": "en"
      },
      {
        "id": "69666cb1-c245-4788-8326-477091b0d966",
        "iconImageUrl": null,
        "serviceImageUrl": "/uploads/services/5a29dc15ecf84c2797f25f7621f885da.png",
        "title": "Full-Stack Web Development",
        "subtitle": "End-to-End Scalable Solutions",
        "description": "Enterprise web applications using modern stacks.",
        "whatWeDeliver": [],
        "features": [],
        "createdAt": "2026-09-01T12:54:37.0382188+00:00",
        "updatedAt": null,
        "resolvedLanguage": "en"
      },
      {
        "id": "0e364fea-896a-4c84-a242-5aa12cc26bd7",
        "iconImageUrl": "/uploads/services_icons/1892d15af82c41c898a9287f0ef7efb6.png",
        "serviceImageUrl": "/uploads/services_main/f918095c8d4e486c90fd57b14514aa6e.jpeg",
        "title": "first thing to be added",
        "subtitle": "subtitle will be shown here",
        "description": "des",
        "whatWeDeliver": [
          "test",
          "abbb"
        ],
        "features": [
          {
            "id": "ee153926-85a8-4373-a705-8fe65d37dc57",
            "imageUrl": "/uploads/services_features/d8d0fb8c6a074578972159d9d767ecf7.png",
            "name": "test",
            "displayOrder": 1
          }
        ],
        "createdAt": "2026-09-19T11:22:18.7353653+00:00",
        "updatedAt": "2026-09-19T11:24:04.6855568+00:00",
        "resolvedLanguage": "en"
      },
      {
        "id": "eae8e959-2407-48e1-ad83-5afd99ee9b23",
        "iconImageUrl": null,
        "serviceImageUrl": "/uploads/services/16436816f66347629248e3c850f14ae5.png",
        "title": "Full-Stack Web Development",
        "subtitle": "End-to-End Scalable Solutions",
        "description": "Enterprise web applications using modern stacks.",
        "whatWeDeliver": [],
        "features": [],
        "createdAt": "2026-09-01T11:48:39.1320104+00:00",
        "updatedAt": null,
        "resolvedLanguage": "en"
      },
      {
        "id": "616393cc-5281-4dd9-a7ae-d8b0bcb462b7",
        "iconImageUrl": null,
        "serviceImageUrl": null,
        "title": "Cloud DevOps",
        "subtitle": "Scalable Cloud Architecture",
        "description": "Enterprise cloud engineering.",
        "whatWeDeliver": [],
        "features": [],
        "createdAt": "2026-09-01T12:57:07.4774359+00:00",
        "updatedAt": null,
        "resolvedLanguage": "en"
      },
      {
        "id": "42778701-a5fb-46d2-8ad8-f1e03ff737e7",
        "iconImageUrl": null,
        "serviceImageUrl": null,
        "title": "Cloud DevOps",
        "subtitle": "Scalable Cloud Architecture",
        "description": "Enterprise cloud engineering.",
        "whatWeDeliver": [],
        "features": [],
        "createdAt": "2026-09-01T11:16:12.4291797+00:00",
        "updatedAt": null,
        "resolvedLanguage": "en"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 6,
    "totalPages": 1
  },
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:40:48 GMT 
 server: Kestrel 
 transfer-encoding: chunked 
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
        "serviceImageUrl": "string",
        "title": "string",
        "subtitle": "string",
        "description": "string",
        "whatWeDeliver": [
          "string"
        ],
        "features": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "imageUrl": "string",
            "name": "string",
            "displayOrder": 0
          }
        ],
        "createdAt": "2026-09-19T11:41:20.207Z",
        "updatedAt": "2026-09-19T11:41:20.207Z",
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
/api/services


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
      "title": "first thing to be added",
      "subtitle": "subtitle will be shown here",
      "description": "des"
    },
    {
      "languageCode": "ar",
      "title": "شسيب",
      "subtitle": "سشيلشسيب",
      "description": "يبالاشيب"
    }
  ]
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'http://localhost:5069/api/services' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "translations": [
    {
      "languageCode": "en",
      "title": "first thing to be added",
      "subtitle": "subtitle will be shown here",
      "description": "des"
    },
    {
      "languageCode": "ar",
      "title": "شسيب",
      "subtitle": "سشيلشسيب",
      "description": "يبالاشيب"
    }
  ]
}'
Request URL
http://localhost:5069/api/services
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "success": true,
  "data": "0e364fea-896a-4c84-a242-5aa12cc26bd7",
  "message": "Service created successfully",
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:22:18 GMT 
 location: http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7 
 server: Kestrel 
 transfer-encoding: chunked 
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
/api/services/{id}


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
0e364fea-896a-4c84-a242-5aa12cc26bd7
language
string
(query)
en
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7?language=en' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I'
Request URL
http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7?language=en
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "data": {
    "id": "0e364fea-896a-4c84-a242-5aa12cc26bd7",
    "iconImageUrl": "/uploads/services_icons/1892d15af82c41c898a9287f0ef7efb6.png",
    "serviceImageUrl": "/uploads/services_main/f918095c8d4e486c90fd57b14514aa6e.jpeg",
    "title": "first thing to be added",
    "subtitle": "subtitle will be shown here",
    "description": "des",
    "whatWeDeliver": [
      "test",
      "abbb"
    ],
    "features": [
      {
        "id": "ee153926-85a8-4373-a705-8fe65d37dc57",
        "imageUrl": "/uploads/services_features/d8d0fb8c6a074578972159d9d767ecf7.png",
        "name": "test",
        "displayOrder": 1
      }
    ],
    "createdAt": "2026-09-19T11:22:18.7353653+00:00",
    "updatedAt": "2026-09-19T11:24:04.6855568+00:00",
    "resolvedLanguage": "en"
  },
  "message": null,
  "errors": null,
  "traceId": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:41:19 GMT 
 server: Kestrel 
 transfer-encoding: chunked 
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
    "serviceImageUrl": "string",
    "title": "string",
    "subtitle": "string",
    "description": "string",
    "whatWeDeliver": [
      "string"
    ],
    "features": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "imageUrl": "string",
        "name": "string",
        "displayOrder": 0
      }
    ],
    "createdAt": "2026-09-19T11:41:20.219Z",
    "updatedAt": "2026-09-19T11:41:20.219Z",
    "resolvedLanguage": "string"
  },
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

PUT
/api/services/{id}


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
      "title": "string",
      "subtitle": "string",
      "description": "string"
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
/api/services/{id}


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
/api/services/{id}/icon


Parameters
Cancel
Reset
Name	Description
id *
string($uuid)
(path)
0e364fea-896a-4c84-a242-5aa12cc26bd7
Request body

multipart/form-data
IconImage
string($binary)
Hero.png
Send empty value
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/icon' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I' \
  -H 'Content-Type: multipart/form-data' \
  -F 'IconImage=@Hero.png;type=image/png'
Request URL
http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/icon
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "data": null,
  "message": "Icon image updated successfully",
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:23:03 GMT 
 server: Kestrel 
 transfer-encoding: chunked 
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
/api/services/{id}/icon


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
/api/services/{id}/service-image


Parameters
Cancel
Reset
Name	Description
id *
string($uuid)
(path)
0e364fea-896a-4c84-a242-5aa12cc26bd7
Request body

multipart/form-data
ServiceImage
string($binary)
puresunDesign.jpeg
Send empty value
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/service-image' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I' \
  -H 'Content-Type: multipart/form-data' \
  -F 'ServiceImage=@puresunDesign.jpeg;type=image/jpeg'
Request URL
http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/service-image
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "data": null,
  "message": "Service image updated successfully",
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:24:04 GMT 
 server: Kestrel 
 transfer-encoding: chunked 
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
/api/services/{id}/service-image


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

POST
/api/services/{id}/what-we-deliver


Parameters
Cancel
Reset
Name	Description
id *
string($uuid)
(path)
0e364fea-896a-4c84-a242-5aa12cc26bd7
Request body

application/json
{
  "translations": [
    {
      "languageCode": "en",
      "text": "abbb"
    },
    {
      "languageCode": "ar",
      "text": "أبب" 
    }
  ],
  "displayOrder": 2
}

Execute
Clear
Responses
Curl

curl -X 'POST' \
  'http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/what-we-deliver' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I' \
  -H 'Content-Type: application/json' \
  -d '{
  "translations": [
    {
      "languageCode": "en",
      "text": "abbb"
    },
    {
      "languageCode": "ar",
      "text": "أبب" 
    }
  ],
  "displayOrder": 2
}
'
Request URL
http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/what-we-deliver
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "data": "20695be2-bda9-4a7e-b3c3-f005c697a4f0",
  "message": "What We Deliver item added successfully",
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:28:15 GMT 
 server: Kestrel 
 transfer-encoding: chunked 
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

PUT
/api/services/{id}/what-we-deliver/{itemId}


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
id
itemId *
string($uuid)
(path)
itemId
Request body

application/json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "translations": [
    {
      "languageCode": "string",
      "text": "string"
    }
  ],
  "displayOrder": 0
}
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
  "data": "string",
  "message": "string",
  "errors": "string",
  "traceId": "string"
}
No links

DELETE
/api/services/{id}/what-we-deliver/{itemId}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
itemId *
string($uuid)
(path)
itemId
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
/api/services/{id}/what-we-deliver/reorder


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
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "displayOrder": 0
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

POST
/api/services/{id}/features


Parameters
Cancel
Reset
Name	Description
id *
string($uuid)
(path)
0e364fea-896a-4c84-a242-5aa12cc26bd7
Request body

multipart/form-data
FeatureImage
string($binary)
pureSunLogo.png
Send empty value
Translations
array
[{
  "languageCode": "en",
  "name": "test"
},
{
  "languageCode": "ar",
  "name": "شيسل"
}
]
-
Add object item
Send empty value
DisplayOrder
integer($int32)
1
Send empty value
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/features' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiJjNDc0ZjExNy0zNTkyLTRlMGItOWE3OC1iOGY0OTllYTVmYjUiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJlYWQ2ZTIxNS02ZjViLTQ2NzQtYmI0NS05YzcyMDA0NzU2NGEiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzg5ODE2OTIwLCJleHAiOjE3ODk5MDMzMjAsImlhdCI6MTc4OTgxNjkyMCwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.kq6xswLm0eVDqSDWh4i9PPF6HvmQ_mKdd1U0N1Zd_7I' \
  -H 'Content-Type: multipart/form-data' \
  -F 'FeatureImage=@pureSunLogo.png;type=image/png' \
  -F 'Translations={"languageCode":"en","name":"test"}' \
  -F 'Translations={"languageCode":"ar","name":"شيسل"}' \
  -F 'DisplayOrder=1'
Request URL
http://localhost:5069/api/services/0e364fea-896a-4c84-a242-5aa12cc26bd7/features
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "data": "ee153926-85a8-4373-a705-8fe65d37dc57",
  "message": "Feature added successfully",
  "errors": null,
  "traceId": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,19 Sep 2026 11:39:32 GMT 
 server: Kestrel 
 transfer-encoding: chunked 
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

PUT
/api/services/{id}/features/{featureId}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
featureId *
string($uuid)
(path)
featureId
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
  ],
  "displayOrder": 0
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
/api/services/{id}/features/{featureId}


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
featureId *
string($uuid)
(path)
featureId
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
/api/services/{id}/features/{featureId}/image


Parameters
Try it out
Name	Description
id *
string($uuid)
(path)
id
featureId *
string($uuid)
(path)
featureId
Request body

multipart/form-data
FeatureImage
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

PUT
/api/services/{id}/features/reorder


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
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "displayOrder": 0
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