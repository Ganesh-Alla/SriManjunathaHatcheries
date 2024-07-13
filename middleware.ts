import { NextResponse } from 'next/server';
import { createClient } from './utils/supabase/server';

export async function middleware(request:NextResponse) {

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

// if(!user) return

  // const sessionToken = request.cookies.get('__Secure-next-auth.session-token') || request.cookies.get('sb-lfbgbietxsnsvwjrelji-auth-token');

if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

return
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
