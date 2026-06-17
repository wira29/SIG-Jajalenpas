import { z } from 'zod';

export async function getUsers() {
    try {
        const response = await fetch(`/api/users`);
        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const schema = z.object({
    id: z.string().optional(),
    name: z.string().min(3),
    email: z.string().email(),
    password: z.nullable(z.string().min(6)).optional(),
    role: z.enum(["superadmin", "operator", "opd", "guest"]),
  });
  
  export type CreateUserFormState = {
    error: Record<string, string> | null;
    success: boolean;
  };
  export async function createUser(
    prevState: CreateUserFormState | null,
    formData: FormData
  ): Promise<CreateUserFormState> {
    const data = schema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });
  
    if (!data.success) {
      return {
        error: data.error.flatten().fieldErrors as Record<string, string>,
        success: false,
      };
    }
  
    const id = data.data.id;
  
    if (!id && !data.data.password) {
      return {
        error: {
          password: "Password harus diisi",
        },
        success: false,
      };
    }
  
    try {
      if (id) {
        await fetch(`/api/users/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.data),
        });

        return {
          error: null,
          success: true,
        };
      }

      await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.data),
      });
    } catch (error) {
      return {
        error: {
          username: "Username sudah digunakan",
        },
        success: false,
      };
    }
  
    return {
      error: null,
      success: true,
    };
  }

  export async function deleteUser(id: number) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.status) {
        throw new Error("Gagal menghapus user");
      }

      return {
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "gagal menghapus user",
        success: false,
      };
    }
  }