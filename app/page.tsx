import { ClientForm } from "@/components/login/client-form";

export default async function LoginPage() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold'>Users</h1>
      <ClientForm />
    </div>
  )
}
