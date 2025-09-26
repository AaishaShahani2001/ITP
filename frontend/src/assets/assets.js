import pet_group from "./pets.jpg"
import arrow from "./arrow_icon.svg"
import fuel from "./fuel_icon.svg"
import search from "./search_icon.svg"
import filter from "./filter_icon.svg"
import logo from "./logo.png"
import profile from "./profile_pic.png"
import dropdown from "./dropdown_icon.svg"
import check from "./check_icon.png"
import user from "./users_icon.svg"
import calendar from "./calendar_icon_colored.png"
import user_profile from "./shakespeare.webp"
import edit from "./edit_icon.svg"
import dashboard from "./dashboardIcon.png"
import dashboard_colored from "./dashboardIconColored.png"
import add from "./addIcon.png"
import add_colored from "./addIconColored.png"
import list from "./listIcon.png"
import list_colored from "./listIconColored.png"
import petIcon from "./petIcon.png"
import petIcon_colored from "./petIconColored.png"
import inventoryIcon from "./inventoryIcon.png"
import inventoryIconColored from "./inventoryIconColored.png"
import edit_black from "./edit_black.png"
import cat1 from "./cat1.jpg"
import cat2 from "./cat2.jpg"
import cat3 from "./cat3.jpg"
import cat4 from "./cat4.jpg"
import dog1 from "./dog1.jpg"
import dog2 from "./dog2.jpg"
import dog3 from "./dog3.jpg"
import dog4 from "./dog4.jpg"
import parrot1 from "./parrot1.jpg"
import parrot2 from "./parrot2.jpg"
import parrot3 from "./parrot3.jpg"
import parrot4 from "./parrot4.jpg"
import rabbit1 from "./rabbit1.jpg"
import rabbit2 from "./rabbit2.jpg"
import rabbit3 from "./rabbit3.jpg"
import rabbit4 from "./rabbit4.jpg"
import pigeon1 from "./pigeon1.jpg"
import pigeon2 from "./pigeon2.jpg"
import pigeon3 from "./pigeon3.jpg"
import pigeon4 from "./pigeon4.jpg"
import food from "./food.png"
import color from "./color.png"
import dog_icon1 from "./dog_icon1.png"
import cat_icon from "./cat_icon.png"
import accept from "./accept.svg"
import reject from "./reject.svg"

export const assets = {
    pet_group,
    arrow,
    fuel,
    search,
    filter,
    logo,
    profile,
    dropdown,
    check,
    user,
    calendar,
    user_profile,
    edit,
    dashboard,
    dashboard_colored,
    add,
    add_colored,
    list,
    list_colored,
    petIcon,
    petIcon_colored,
    inventoryIcon,
    inventoryIconColored,
    edit_black,cat1,
    cat2,
    cat3,
    cat4,
    dog1,
    dog2,
    dog3,
    dog4,
    parrot1,
    parrot2,
    parrot3,
    parrot4,
    rabbit1,
    rabbit2,
    rabbit3,
    rabbit4,
    pigeon1,
    pigeon2,
    pigeon3,
    pigeon4,
    food,
    color,
    dog_icon1,
    cat_icon,
    accept,
    reject
}

export const adminMenuLinks = [
    { name: "Dashboard", path: "/admin", icon: dashboard, coloredIcon: dashboard_colored },
    { name: "Manage Pets", path: "/admin/manage-pet", icon: petIcon, coloredIcon: petIcon_colored },
    { name: "Manage Adoption", path: "/admin/manage-adoption", icon: list, coloredIcon: list_colored },
    { name: "Manage Inventory", path: "/admin/manage-inventory", icon: inventoryIcon, coloredIcon: inventoryIconColored },
]

export const caretakerMenuLinks = [
    { name: "Dashboard", path: "/caretaker", icon: dashboard, coloredIcon: dashboard_colored },
    { name: "Add Pet", path: "/caretaker/add-pet", icon: add, coloredIcon: add_colored },
]

export const dummyPetData = [
    {
        "_id": "pet1",
        "species": "Dog",
        "breed": "German Shepherd",
        "gender": "Male",
        "color": "Black & Tan",
        "diet": "Protein rich kibble",
        "image": dog2,
        "age": 3,
        "price": 50000,
        "medical": "In good condition",
        "born": "2022-12-29",
    },
    {
        "_id": "pet2",
        "species": "Dog",
        "breed": "Shih Tzu",
        "gender":"Female",
        "color": "White with brown patches",
        "diet": "High-quality dry kibble with boiled chicken",
        "image": dog1,
        "age": 2,
        "price": 30000,
        "medical": "Vaccinated, Dewormed",
        "born": "2023-06-14",
    },
    {
        "_id": "pet3",
        "species": "Cat",
        "breed": "Rag Doll",
        "gender": "Female",
        "color": "Cream with seal point markings",
        "diet": "Premium dry cat food with cooked fish or chicken",
        "image": cat1,
        "age": 1,
        "price": 15000,
        "medical": "Vaccinated, spayed",
        "born": "2024-05-27",
    },
    {
        "_id": "pet4",
        "species": "Parrot",
        "breed": "Conure",
        "gender": "Male",
        "color": "Bright yellow, orange and green",
        "diet": "Seeds, fresh fruits, leafy greens",
        "image": parrot1,
        "age": 1,
        "price": 8000,
        "medical": "Vaccinated, wings clipped for safety",
        "born": "2024-10-08",
    },
    {
        "_id": "pet5",
        "species": "Cat",
        "breed": "Persian",
        "gender": "Female",
        "color": "White",
        "diet": "Cat food and fish",
        "image": cat2,
        "age": 2,
        "price": 20000,
        "medical": "Vaccinated",
        "born": "2023-07-29",
    },
    {
        "_id": "pet6",
        "species": "Dog",
        "breed": "Labrador Retriever",
        "gender":"Male",
        "color": "Golden",
        "diet": "Dry kibble and chicken",
        "image": dog3,
        "age": 3,
        "price": 50000,
        "medical": "Vaccinated, neutered",
        "born": "2022-09-10",
    },
    {
        "_id": "pet7",
        "species": "Rabbit",
        "breed": "Angora",
        "gender": "Female",
        "color": "White fluffy",
        "diet": "Carrots, hay",
        "image": rabbit1,
        "age": 2,
        "price": 20000,
        "medical": "In good condition",
        "born": "2023-10-25",
    },
    {
        "_id": "pet8",
        "species": "Parrot",
        "breed": "Macaw",
        "gender": "Male",
        "color": "Blue and Yellow",
        "diet": "Seeds, fruits",
        "image": parrot2,
        "age": 3,
        "price": 9500,
        "medical": "Vaccinated",
        "born": "2022-09-17",
    },
    {
        "_id": "pet9",
        "species": "Parrot",
        "breed": "Cockatiel",
        "gender": "Male",
        "color": "Grey and yellow",
        "diet": "Seeds, veggies",
        "image": parrot4,
        "age": 2,
        "price": 15000,
        "medical": "Vaccinated",
        "born": "2023-03-22",
    },
    {
        "_id": "pet10",
        "species": "Cat",
        "breed": "British Shorthair",
        "gender":"Male",
        "color": "Blue-grey",
        "diet": "Chicken and kibble",
        "image": cat3,
        "age": 1,
        "price": 40000,
        "medical": "Neutered",
        "born": "2024-04-10",
    },
    {
        "_id": "pet11",
        "species": "Cat",
        "breed": "Maine Coon",
        "gender": "Male",
        "color": "Brown tabby",
        "diet": "Dry fruit, tuna",
        "image": cat4,
        "age": 5,
        "price": 35000,
        "medical": "In good condition",
        "born": "2020-10-19",
    },
    {
        "_id": "pet12",
        "species": "Pigeon",
        "breed": "White Dove",
        "gender": "Female",
        "color": "White",
        "diet": "Seeds",
        "image": pigeon1,
        "age": 2,
        "price": 7000,
        "medical": "In good condition",
        "born": "2023-11-17",
    },
    {
        "_id": "pet13",
        "species": "Parrot",
        "breed": "Lovebird",
        "gender": "Female",
        "color": "Green and orange",
        "diet": "Millet, fresh fruit",
        "image": parrot3,
        "age": 2,
        "price": 9000,
        "medical": "In good condition",
        "born": "2023-03-12",
    },
    {
        "_id": "pet14",
        "species": "Pigeon",
        "breed": "Rock Pigeon",
        "gender":"Male",
        "color": "Grey",
        "diet": "Grains, seeds",
        "image": pigeon2,
        "age": 3,
        "price": 6000,
        "medical": "Vaccinated",
        "born": "2023-09-18",
    },
    {
        "_id": "pet15",
        "species": "Pigeon",
        "breed": "Racing Homer",
        "gender": "Male",
        "color": "Blue-grey",
        "diet": "Corn, peas",
        "image": pigeon3,
        "age": 3,
        "price": 7500,
        "medical": "Wing strong",
        "born": "2023-05-19",
    },
    {
        "_id": "pet16",
        "species": "Rabbit",
        "breed": "Dutch",
        "gender": "Male",
        "color": "Black and white",
        "diet": "Veggies, pellets",
        "image": rabbit2,
        "age": 1,
        "price": 25000,
        "medical": "Dewormed",
        "born": "2024-02-15",
    },
    {
        "_id": "pet17",
        "species": "Dog",
        "breed": "Beagle",
        "gender": "Male",
        "color": "Tricolor",
        "diet": "Chicken, rice",
        "image": dog4,
        "age": 2,
        "price": 48000,
        "medical": "Dewormed",
        "born": "2023-06-29",
    },
    {
        "_id": "pet18",
        "species": "Rabbit",
        "breed": "Lop",
        "gender":"Female",
        "color": "Brown",
        "diet": "Fresh greens",
        "image": rabbit3,
        "age": 1,
        "price": 27000,
        "medical": "In good condition",
        "born": "2024-01-30",
    },
    {
        "_id": "pet19",
        "species": "Pigeon",
        "breed": "Fantail",
        "gender": "Female",
        "color": "White",
        "diet": "Grains",
        "image": pigeon4,
        "age": 2,
        "price": 9600,
        "medical": "Vaccinated",
        "born": "2023-11-20",
    },
    {
        "_id": "pet20",
        "species": "Rabbit",
        "breed": "Rex",
        "gender": "Male",
        "color": "Black and white",
        "diet": "Hay, carrots",
        "image": rabbit4,
        "age": 3,
        "price": 32000,
        "medical": "Vaccinated",
        "born": "2022-07-12",
    }
];

export const dummyAdoptionData = [
    {
        "_id": "879y3428fb",
        "adopter": "Megan",
        "pet": dummyPetData[0],
        "date": "2025-08-26",
        "visit": "2025-09-23",
        "status": "pending",
        "price": "20000",
        "address": "Malabe",
        "phone": "0761234567",
        "age": "22",
    },
    {
        "_id": "87icuwg43428fb",
        "adopter": "Neru",
        "pet": dummyPetData[2],
        "date": "2025-07-26",
        "visit": "2025-09-01",
        "status": "approved",
        "price": "25000",
        "address": "Matara",
        "phone": "0761231234",
        "age": "19",
    },
    {
        "_id": "hh323j2k348fb",
        "adopter": "Shesha",
        "pet": dummyPetData[1],
        "date": "2025-08-12",
        "visit": "2025-08-18",
        "status": "rejected",
        "price": "32000",
        "address": "Jaffna",
        "phone": "0712233122",
        "age": "26",
    }
];

export const dummyUserData = [
    {
        "_id": "89u2rfjhui",
        "name": "Michel",
        "email": "admin@example.com",
        "role": "Admin",
        "image": user_profile,
    },
    {
        "_id": "8wefjhui",
        "name": "Rafael",
        "email": "caretaker@example.com",
        "role": "Caretaker",
        "image": user_profile,
    }
]

export const dummyDashboardData = [
    {
        "totalPet": "5",
        "totalAdoption": "8",
        "pendingAdoption": "2",
        "completedAdoption": "4",
        "rejectedAdoption": "2",
        "revenue_Adoption": "40000",
    }
]