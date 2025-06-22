import { redirect } from 'next/navigation'

export default function SignupPage() {
  // Redirect to the auth login page which handles both login and signup
  redirect('/auth/login')
}
