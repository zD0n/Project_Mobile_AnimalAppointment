Status
    
    Health - Working
    Register - Working
    Login - Working
    Update User info from User ID - Working
    List User info from User ID - Working

    Insert Pet - Working
    List Pet from User ID - Working
    List Pet info from Pet ID - Working
    Update Pet info from ID - Working

    Insert Medical Record - Working
    List Medical Record from Pet ID - Working
    List Medical Record info from Record ID - Working

    Insert Appointment - Working
    List Appointment from User ID - Working
    List Appointment from Doc ID - Working
    Delete Appointment from App ID - Working


    List Doctor - Working
    Register for Docter - Working

# API Usage

## Health Check

GET /health

Check if the API server is running.

---

## Register User

POST /register

Request Body
{
  "username": "Donno",
  "password": "123",
  "confirm_password": "123"
}

## Register Doctor

POST /register/doctor

Request Body
{
    "specialization":"toe",
    "work_time":"24/6"
}

---

## Login

POST /login

Request Body
{
  "username": "Donno",
  "password": "123"
}

---

## Get User Info

GET /infoUser/:user_id

Example
/infoUser/1

---

## Update User

PUT /updateUser/:user_id

Example
/updateUser/1

Request Body
{
  "full_name": "Thanakrit",
  "phone": "012"
}

---

## Insert Pet

POST /insertPet/:user_id

Example
/insertPet/1

Request Body
{
    "pet_name":"Pn",
    "species":"Dog",
    "pet_breed":"uh",
    "bloodtype":"R",
    "birth_date":"2020/01/01",
    "pet_gender":"F",
    "weight":1,
    "allergy":"Food",
    "pet_image_url":""
}

---

## Get Pets (Home Page)

GET /getpets/:user_id

Example
/getpets/1

---

## Get Pet Info

GET /infopet/:pet_id

Example
/infopet/1

---

## Update Pet

PUT /updatePet/:pet_id

Example
/updatePet/1

Request Body
{
  "pet_name": "Pp",
  "species": "??",
  "bloodtype": "F",
  "birth_date": "1000-08-21",
  "weight": "99",
  "allergy": "uhh"
}

## Insert Appointment

POST /insertAppointment/:pet_id/:user_id/:doc_id

Example /insertAppointment/1/1/1
Request Body
{
    "app_date":"2026-03-11",
    "app_time":"10:35:00",
    "reason":"ขาหัก"
}

## Delete Appointment

PUT /deleteAppointment/:app_id

Example /deleteAppointment/1

## Get Appointment List for User

GET /getUserAppointmentslist/:user_id

Example /getUserAppointmentslist/1

## Get Appointment List for Doctor

GET /getDoctorAppointmentslist/:doc_id

Example /getDoctorAppointmentslist/1

## Insert Medical Record

POST /insertMedRecord/:pet_id/:doc_id/:app_id

Example /insertMedRecord/1/1/1
Request Body
{
    "diagnosis":"ขาหัก",
    "treatment_detail":"เอาพาราไปกิน เด๊๋ยวก็หาย",
    "treatment_date":"2026-03-11",
    "treatment_time":"10:35:00"
}

## Update MedRecord

PUT updateMedRecord/:record_id

Example /updateMedRecord/1
Request Body
{
    "diagnosis":"Uhh",
    "treatment_detail":"Something",
    "cost":0,
    "treatment_date":"2024-07-01",
    "treatment_time":"15:30:00"
}

## Get Medical Record from Pet ID

GET /getMedicalRecord/:pet_id

Example /getMedicalRecord/1

## Get Medical Info Record

GET /getMedicalRecordInfo/:record_id

Example /getMedicalRecordInfo/1

## Get Doctor List

GET /getDoctors

Example /getDoctors