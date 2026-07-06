type name = string;

interface User {
    name: name,
    age: number,
    email?: string;

}

const newUser: User = {
    name: "John",
    age: 30,
    email: "[EMAIL_ADDRESS]"
};

console.log(newUser);