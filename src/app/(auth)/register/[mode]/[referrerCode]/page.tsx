import RegisterForm from "../../components/register-form"

type Props = {
  params: {
    mode: 'automatic' | 'manual';
    referrerCode: string;
  };
};

export default async function Register({ params }: { params: Promise<Props['params']> }) {
  const { mode, referrerCode } = await params;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RegisterForm mode={mode} referrerCode={referrerCode} />
    </div>
  )
}
