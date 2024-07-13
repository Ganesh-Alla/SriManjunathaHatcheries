import { Anton, Inter, Lusitana, Poppins } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin']
})

export const poppins = Poppins({
    weight: ['400', '700'],
    subsets: ['latin']
})
export const anton = Anton(
   {
    weight: ['400' ],
    subsets: ['latin']
}
)