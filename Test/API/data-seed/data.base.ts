/**
model users {
  id              Int       @id @default(autoincrement())
  full_name       String    5< x <21
  username        String    @unique   5< l <21
  password        String              5< l <21
  hashed_password String              5< l <21
  role            String
  phone           String?
  email           String?   @unique
  create_at       DateTime  @default(now())
  update_at       DateTime?
  avatar_url      String?
}


export const registerUserSchema = z.object(
    {
        body: z.object({
            user: z.object({
            full_name: z.string().min(6, "full name must be at least 6 characters long").max(20, "full name must be at most 20 characters long"),
            username: z.string().min(6, "username must be at least 6 characters long").max(20, "username must be at most 20 characters long"),
            password: z.string().min(6, "password must be at least 6 characters long").max(20, "password must be at most 20 characters long"),
            phone: z.string().min(10, "phone must be at least 10 digits long").max(15, "phone must be at most 15 digits long").optional(),
            email: z.email().nullish(),
            role: z.enum(['user'])
            })
        })
    }
);

export const loginUserSchema = z.object({
    body: z.object({
        user: z.object({
        username: z.string().min(6, "username must be at least 6 characters long").lowercase(),
        password: z.string().min(6, "password must be at least 6 characters long"),
    })
})
});

export  const userSchema = z.object({
    body: z.object(
        {
            user: z.object({
            full_name: z.string().min(6, "full name must be at least 6 characters long").max(20, "full name must be at most 20 characters long"),
            username: z.string().min(6, "username must be at least 6 characters long").max(20, "username must be at most 20 characters long"),
            password: z.string().min(6, "password must be at least 6 characters long").max(20, "password must be at most 20 characters long").nullish(),
            phone: z.string().min(10, "phone must be at least 10 digits long").max(15, "phone must be at most 15 digits long").nullish(),
            email: z.email().nullish(),
            role: z.enum(['user', 'admin']),
        })
    })
});
*/



// Create a blueprint functions allowing generate new data

export const BaseDataSupport = () => {

  // Valid values
  const fullname_five_chars = () => {
    // return a random string with length of 5
    return Math.random().toString(36).substring(2, 5)
  }
  // Under Bound values

  // Upper Bound values

  // Informal values
}