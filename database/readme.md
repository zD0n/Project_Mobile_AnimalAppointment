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

    Insert Medical Record - Haven't Test
    List Medical Record from Pet ID - Haven't Test
    List Medical Record info from Record ID - Haven't Test

    Insert Appointment - Haven't Test
    List Appointment from User ID - Haven't Test


    List Doctor - In progress

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
  "pet_name": "Pp",
  "pet_type": "??",
  "pet_age": "1000-08-21"
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