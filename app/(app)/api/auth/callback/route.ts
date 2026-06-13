import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method can be called from a Server Component
              // which cannot modify cookies. It's safe to ignore this error
              // if you are handling redirects right after.
            }
          },
        },
      }
    );

    // This exchanges the temporary code from Google/Supabase for a real user session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after successful sign in
  return NextResponse.redirect(`${requestUrl.origin}/onboarding/personal-details`);
}