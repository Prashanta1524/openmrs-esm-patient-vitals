# PowerShell script to import Counselor Form into OpenMRS

# Configuration
$openmrsUrl = "http://localhost:8080"  # Change this to your OpenMRS URL
$username = "admin"                    # Change this to your username
$password = "Admin123"                 # Change this to your password

# Create base64 encoded credentials
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))

# Form JSON content
$formJson = @'
{
  "name": "Counselor Form",
  "pages": [
    {
      "label": "Counselor Form",
      "sections": [
        {
          "label": "Opening Conversation",
          "isExpanded": true,
          "questions": [
            {
              "label": "नमस्ते, धन्यवाद छ, तपाईंले समय निकालेर INCLUDE फारम भरिदिनुभयो। यो फारम हामीले तपाईंको लान्छना सम्बन्धी अनुभव बुझ्नको लागि बनाएका हौं। तपाईंले जुन जवाफ दिनुभयो, त्यसको आधारमा तपाईंको स्कोर …... आएको छ।",
              "id": "counselor_intro_note",
              "readonly": true,
              "type": "obs",
              "questionOptions": {
                "rendering": "text",
                "concept": "48a4e5dc-5880-44d9-bca8-6b73ac84f282"
              }
            },
            {
              "type": "obs",
              "questionOptions": {
                "rendering": "textarea",
                "concept": "b7e06e2b-731f-4416-89c3-8ffcd98ae25c",
                "rows": 4
              },
              "id": "plwh_thoughts_score",
              "label": "१. तपाईंलाई यी स्कोरहरुको बारेमा के लाग्छ?"
            },
            {
              "type": "obs",
              "questionOptions": {
                "rendering": "textarea",
                "concept": "4bd3baea-6fd5-4100-9e9f-4828b3824eca",
                "rows": 4
              },
              "id": "less_score",
              "label": "२. यी स्कोरहरु कम वा बढी हुन पनि सक्थ्यो, तपाईंको विचारमा, के भइदिएको भए  कम हुन सक्थ्यो होला?"
            },
            {
              "type": "obs",
              "questionOptions": {
                "rendering": "textarea",
                "concept": "1b8683db-7f8f-4318-a3e4-e2ca9cedc409",
                "rows": 4
              },
              "id": "reason_more_score",
              "label": " ३. यी स्कोरहरु कम वा बढी हुन पनि सक्थ्यो, तपाईंको विचारमा, के कारणले गर्दा अझ बढी भएन होला?"
            },
            {
              "type": "obs",
              "questionOptions": {
                "rendering": "radio",
                "concept": "61d1200e-7884-4413-b734-c0e5b20ede52",
                "answers": [
                  {
                    "concept": "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "label": "भयो"
                  },
                  {
                    "concept": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "label": "भएन"
                  }
                ]
              },
              "id": "new_stigma_identified",
              "label": "४. के तपाइले कुनै नयाँ लान्छना पत्ता लगाउनु भयो?"
            }
          ]
        },
        {
          "label": "Post-Counselling Debrief",
          "isExpanded": "true",
          "questions": [
            {
              "type": "obs",
              "questionOptions": {
                "rendering": "radio",
                "concept": "b2dec3f6-1908-4579-b7e7-f16c179642dd",
                "answers": [
                  {
                    "concept": "746e01c0-0e93-4c07-ae02-920f721e5eca",
                    "label": "गतिविधी १: एचआइभी संक्रमित व्यक्तिहरूलाई आत्मसक्षमता र आत्मसम्मान बढाउन सहयोग हुने परामर्श दिनुहोस्।"
                  },
                  {
                    "concept": "ee6ff857-401f-4492-a98c-880a3838ec64",
                    "label": "गतिविधी २: एचआईभी संक्रमित व्यक्तिहरूलाई सपोर्ट ग्रुपसँग जोडिन सहयोग गर्नुहोस् ।"
                  }
                ]
              },
              "id": "activity_recommended",
              "label": "तपाइँले कुन गतिविधीको सुझाव दिनुभयो?"
            },
            {
              "type": "obs",
              "questionOptions": {
                "rendering": "checkbox",
                "concept": "2b359951-a20c-47ff-8379-59541d2619ee",
                "answers": [
                  {
                    "concept": "b080dd57-7296-41b7-b61c-565b80748d72",
                    "label": "१. एचआइभी सम्बन्धि जनचेतना"
                  },
                  {
                    "concept": "91c8602e-2eb1-478f-801a-7d92ec51378f",
                    "label": "२. मानसिक स्वास्थ्य (डरको व्यवस्थापन)"
                  },
                  {
                    "concept": "d36a20a7-cc83-41db-ac63-a0e49aca38ae",
                    "label": "३.  लैङ्गिक वा  यौनिक अल्पसङ्ख्यक"
                  },
                  {
                    "concept": "94bd8732-b00d-445b-a2e9-5c10a54719d9",
                    "label": "४. - बिडीएस सपोर्ट ग्रुप , स्वतन्त्र पथ, बुटवल, रूपन्देही, हसिना चौहान, basantchauhan702@gmail.com, 9804489708"
                  },
                  {
                    "concept": "084bf2bd-50ca-4c64-8c87-2e89f473e00a",
                    "label": "५. बिडीएस सपोर्ट ग्रुप, मुर्ली बगैचा, वीरगञ्ज, पर्सा , टीका कार्की, parsachemsexdic@gmail.com, 9809108056"
                  },
                  {
                    "concept": "6cfbab4c-8497-4476-93d4-afc665860b5f",
                    "label": "६. बिडीएस सपोर्ट ग्रुप , नील सरस्वतीथान, खुरसानिटार, काठमाडौं, सुजन लिम्बु, dhanabahadur208@gmail.com, 9823099229"
                  },
                  {
                    "concept": "b31ac3c4-2852-48af-86c0-6d0b492c9197",
                    "label": " ७. एनएपि+एन, बालुवाटार, काठमाडौं,  info@napn.org.np"
                  },
                  {
                    "concept": "e386d0c9-3f4b-4e43-b49f-3299820c214a",
                    "label": "८. एनएफडब्लुएलएचए ,नयाँ बानेश्वर, काठमाडौं, nfwlha007@gmail.com"
                  }
                ]
              },
              "id": "resources_shared",
              "label": "तपाईंले कस्तो श्रोतहरु प्रदान गर्नुभयो?"
            }
          ]
        }
      ]
    }
  ],
  "processor": "EncounterFormProcessor",
  "encounterType": "d7151f82-c1f3-4152-a605-2f9ea7414a79",
  "referencedForms": [],
  "uuid": "effc3190-3189-4fc2-9a19-ffee5d5ece95",
  "description": "A form filled out by counselor",
  "version": "1"
}
'@

Write-Host "Starting OpenMRS Counselor Form Import..." -ForegroundColor Green

# Step 1: Create the form definition
Write-Host "`nStep 1: Creating form definition..." -ForegroundColor Yellow

$formDefinition = @{
    name = "Counselor Form"
    version = "1"
    description = "A form filled out by counselor"
    encounterType = "d7151f82-c1f3-4152-a605-2f9ea7414a79"
    uuid = "effc3190-3189-4fc2-9a19-ffee5d5ece95"
    published = $true
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Basic $credentials"
}

try {
    $formResponse = Invoke-RestMethod -Uri "$openmrsUrl/openmrs/ws/rest/v1/form" -Method POST -Body $formDefinition -Headers $headers
    Write-Host "✓ Form created successfully!" -ForegroundColor Green
    Write-Host "Form UUID: $($formResponse.uuid)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error creating form:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Try to check if form already exists
    try {
        $existingForm = Invoke-RestMethod -Uri "$openmrsUrl/openmrs/ws/rest/v1/form/effc3190-3189-4fc2-9a19-ffee5d5ece95" -Headers $headers
        Write-Host "Form already exists, continuing with form resource creation..." -ForegroundColor Yellow
    } catch {
        Write-Host "Form does not exist and creation failed. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Step 2: Create the form resource with JSON schema
Write-Host "`nStep 2: Creating form resource with JSON schema..." -ForegroundColor Yellow

$formResource = @{
    form = "effc3190-3189-4fc2-9a19-ffee5d5ece95"
    name = "JSON schema"
    dataType = "AmpathJsonSchema"
    valueReference = $formJson
} | ConvertTo-Json -Depth 20

try {
    $resourceResponse = Invoke-RestMethod -Uri "$openmrsUrl/openmrs/ws/rest/v1/formresource" -Method POST -Body $formResource -Headers $headers
    Write-Host "✓ Form resource created successfully!" -ForegroundColor Green
    Write-Host "Resource UUID: $($resourceResponse.uuid)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error creating form resource:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Step 3: Verify the form
Write-Host "`nStep 3: Verifying form import..." -ForegroundColor Yellow

try {
    $verifyForm = Invoke-RestMethod -Uri "$openmrsUrl/openmrs/ws/rest/v1/form/effc3190-3189-4fc2-9a19-ffee5d5ece95?v=full" -Headers $headers
    Write-Host "✓ Form verification successful!" -ForegroundColor Green
    Write-Host "Form Name: $($verifyForm.name)" -ForegroundColor Cyan
    Write-Host "Form Published: $($verifyForm.published)" -ForegroundColor Cyan
    Write-Host "Form Resources: $($verifyForm.resources.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error verifying form:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nForm import process completed!" -ForegroundColor Green
Write-Host "You can now test the form in your dashboard using the debug buttons." -ForegroundColor Cyan