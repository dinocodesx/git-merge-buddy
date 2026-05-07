export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        {/* We will add the LoginForm component here after installing shadcn components */}
        <div className="text-center text-sm">
           Login form placeholder
        </div>
      </div>
    </div>
  );
}
