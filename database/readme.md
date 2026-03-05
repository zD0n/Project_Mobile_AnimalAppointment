Status
    Health - Working
    Register - Working
    Login - Working
    Update User info from ID - Working
    List User info from ID - Working

    Insert Pet - Working
    List Pet from ID - Working
    List Pet info from Pet ID - Working
    Update Pet info from ID - Working

    List Medical Record from Pet ID - In progress
    List Doctor - In progress
    Insert Appointment - In progress
    List Appointment - In progress
    Insert Medical Record - In progress

Usage

Method GET /health

Method POST /register
{
    "username":"Donno",
    "password":"123",
    "confirm_password":"123"
}

Method POST /login
{
    "username":"Donno",
    "password":"123"
}

Method GET /infoUser/:user_id

/infoUser/1

Method PUT /updateUser/:user_id

/updateUser/1
{
    "full_name":"Thanakrit",
    "phone":"012"
}

Method POST /insertPet/:user_id

/insertPet/1
{
    "pet_name":"Pp",
    "pet_type":"??",
    "pet_age":"1000-08-21"
}


Method GET /getpets/:user_id 
สำหรับหน้า Home
/getpets/1

Method GET /infopet/:pet_id

/infopet/1

Method PUT /updatePet/:pet_id

/updatePet/1
{
    "pet_name":"Pp",
    "species":"??",
    "bloodtype":"F",
    "birth_date":"1000-08-21",
    "weight":"99",
    "allergy":"uhh"
}