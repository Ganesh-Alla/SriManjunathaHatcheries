
import { anton, lusitana, poppins } from '@/app/ui/fonts';
import { createClient } from '@/utils/supabase/server';


export default async function DisplayName() {
const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  const { data: users, error } = await supabase
  .from('users')
  .select('name')
  .eq('email', user?.email)



  return (
    <div
      className={`${poppins.className} flex flex-row items-center leading-none text-white`}
    ><div>
      <span className={`${lusitana.className}`}>Welcome.. </span><br/>
      <span className='text-lg'>{users && users[0]?.name}!</span>
      </div>
    </div>
  );
}
