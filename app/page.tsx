import Image from "next/image";
// import AppSearch from "@/components/AppSearch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { CopyIcon, ExternalLink, GithubIcon, Heart, HeartHandshake, HeartIcon, ReplyIcon } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic'
import { cn } from "@/lib/utils";

const CodeBlock = dynamic(() => import('@/components/code-block'), {
  loading: () => <p>Loading codeblock...</p>,
})

const AppSearch = dynamic(() => import('@/components/AppSearch'), {
  ssr: false,
  loading: () => <div className="border border-gray-100 dark:border-gray-800 overflow-hidden w-full h-[395px] bg-white dark:bg-gray-950 flex flex-col text-gray-500 rounded-xl">
    {/* <Skeleton className="w-full h-10 bg-gray-200 dark:bg-gray-800" /> */}
    <div className="h-11 flex p-3 items-center gap-3 border-b border-gray-500/20">
      <Skeleton className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded-full" />
      <Skeleton className="w-[14ch] h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="flex flex-col p-2 gap-3 min-h-[20.8rem] max-h-[20.8rem] overflow-hidden">


      <div className="w-full flex items-center justify-center">
        <Skeleton className="w-[20ch] h-16 my-8 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>

      <Skeleton className="w-[12ch] h-3 bg-gray-100  dark:bg-gray-800 rounded" />
      {Array(3).fill(1).map((n, i) =>
        <div key={i} className="w-full flex gap-1">
          <Skeleton className="h-8 w-8  bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex flex-col w-full justify-between">
            <Skeleton className="h-3 w-[12ch] bg-gray-200  dark:bg-gray-700 rounded" />
            <Skeleton className={cn("h-3 bg-gray-100  dark:bg-gray-800 rounded w-[30ch]")} />
          </div>
        </div>
      )}

    </div>
    <div className="flex-1 p-1 px-2 flex justify-between">
      <Skeleton className="w-[10ch] h-3 bg-gray-200  dark:bg-gray-700 rounded" />
      {/* <Skeleton className="w-[10ch] h-3 bg-gray-200  dark:bg-gray-700 rounded" /> */}
    </div>

  </div>
})




const GitHubButton = () => (
  <Link passHref href="https://github.com/pratiqdev/zrch"  target="_blank">

  <Button
    variant="ghost"
    className="w-min sm:w-full flex items-center gap-2 pl-2 pr-4 group border border-transparent group-hover:border-black"
    >
    <div className="rounded-full bg-gray-600 text-gray-100 h-6 w-6 flex items-center justify-center text-center overflow-hidden p-1 group-hover:bg-gray-900  duration-200">
      <GithubIcon />
    </div>
    pratiqdev/zrch
  </Button>
  </Link>
)

const NpmButton = () => (
  <Link passHref href="https://npmjs.org"  target="_blank" className="pointer-events-none">
    
  <Button
  disabled
    variant="secondary"
    className="relative w-min sm:w-full flex items-center gap-2 px-2 pl-4 group group-hover:line-through group-hover/linkbox:bg-red-500"
    >
    {/* <div className="absolute top-[-1.5rem] right-[-.5rem] group-hover:text-orange-500 group-hover:bounce duration-200">beta<ReplyIcon className="rotate-[20deg]  translate-x-5"/></div> */}
    npm install zrch
    <div className="rounded-full bg-gray-200 text-gray-900 h-6 w-6 flex items-center justify-center text-center overflow-hidden p-1 bg-grey-300  group-hover:bg-gray-400 duration-200">
      <CopyIcon />
    </div>
  </Button>
  </Link>
)

const UserButton = () => (
  <Link passHref href="https://github.com/pratiqdev"  target="_blank">

  <Button
    variant="secondary"
    className="w-min sm:w-full flex items-center gap-2 px-2 pl-4 group"
  >
    pratiqdev
    <div className="relative rounded-full bg-gray-200 text-gray-900 h-6 w-6 flex items-center justify-center text-center overflow-hidden p-1 bg-grey-300  group-hover:bg-gray-400 duration-200">
      <Image fill alt='avatar' src='https://avatars.githubusercontent.com/u/53705976?v=4' />
    </div>
  </Button>
  </Link>
)

export default function Home() {
  return (
    <main
      className="flex flex-col items-center max-w-[700px] mx-auto pb-6"
      suppressHydrationWarning
    >

      <div className="absolute top-4 right-4">
       <ThemeSwitch />
      </div>

        <div className="spot spot-1"></div>
        <div className="spot spot-2"></div>
        <div className="spot spot-3"></div>
        <div className="spot spot-4"></div>
        <div className="spot spot-5"></div>
        <div className="spot spot-6"></div>
        <div className="spot spot-7"></div>
        <div className="spot spot-8"></div>
        <div className="spot spot-9"></div>
        <div className="spot spot-10"></div>

      <section className="min-h-[90vh] pt-8">
         <div className="flex flex-col sm:flex-row items-center justify-between w-full">
           <div className="w-full">
             <h1 className="text-sm tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-1 px-2 w-min">v0.0.1</h1>
             <h1 className="text-5xl font-bold tracking-wide blur animate-unblur">zrch</h1>
             <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-300 tracking-wide">
               Feature-rich <div className="blur animate-partial-unblur inline">fuzzy</div> search for React
             </div>
         
           </div>
           <div className="relative flex flex-row-reverse sm:flex-col pt-8 sm:pt-0 items-end gap-2 font-regular flex-wrap group group-linkbox">
             <NpmButton />
             <GitHubButton />
            <div className="absolute top-[.5rem] sm:top-[-2rem] text-sm right-[-1rem] text-gray-400 group-hover:text-orange-500 group-hover:scale-[1.2] duration-200">beta<ReplyIcon className="rotate-[50deg] group-hover:rotate-[70deg] duration-200 translate-x-2" /></div>

           </div>
         </div>

         <AppSearch />
           
    

         <div className="text-xs sm:text-lg text-gray-500 dark:text-gray-300 tracking-wide flex flex-col text-center items-center blur animate-unblur">
           <p className=" flex items-baseline font-medium">
             Made with <Heart className="mx-1 text-sm h-4" /> and
           </p>
         <div className="flex gap-2 font-light py-1 tracking-wider">
           <Link target="_blank" href="https://fusejs.io" className="hover:underline">fuse.js</Link> |
           <Link target="_blank" href="https://ui.shadcn.com/" className="hover:underline">shadcn-ui</Link> | 
           <Link target="_blank" href="https://tailwindcss.com/" className="hover:underline">tailwind</Link>
         </div>
           <p className=" flex items-baseline font-medium">
             by pratiqdev
           </p>
         </div>
      </section>


      <section className="pt-[10vh]">
        <CodeBlock code={`
import Zrch, { useZrch } from 'zrch'

<Zrch 

  // provide any data, consistency recommended
  searchable={[ ... ]}

  // customize your search results
  threshold={ 0.6 }
  fieldNorm={ 0.8 }
  distance={ 200 }
  minMatch={ 3 }

  // easily handle click and keyboard events
  onSelect={(result, index) => 
    console.log('Selected item:', result) 
  }

  // render your own items
  RenderItem={(result, index) => 
    <p>{result.title}</p>
  }

/>
      `} />
        <div className="w-min">
          <UserButton />
        </div>
          <small className="text-gray-500 text-sm w-full flex justify-center">Site inspired by{` `}<Link target="_blank" className="underline flex ml-1 items-center" href="https://cmdk.paco.me">cmdk.paco.me</Link></small>
      </section>
 

     

    </main>
  );
}
// // set your own weights and value paths
// keys = {
//   [
//   'title',
//   {
//     name: 'content',
//     weight: 0.4,,
//   },
//   {
//     name: 'tags'
//       weight: 0.2,
//     getFn: (obj, path) => obj.user.tags
//   }
//   ]}

     
//       <section className="w-full min-h-[90vh] w-full flex flex-col items-center  justify-start pt-8 sm:pt-0 sm:justify-center">
//         <div className="flex flex-col sm:flex-row items-center justify-between w-full px-6 pb-16">
//           <div className="w-full">
//             <h1 className="text-sm tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mb-[-.5rem] rounded px-2 w-min">v0.1.0</h1>
//             <h1 className="text-5xl font-bold tracking-wide">zrch</h1>
//             <p className="text-xl text-gray-500 dark:text-gray-300 tracking-wide">
//               Drop-in, feature-rich, search for React
//             </p>
         
//           </div>
//           <div className="flex flex-row-reverse sm:flex-col pt-8 sm:pt-0 items-end gap-2 font-regular flex-wrap">
//             <NpmButton />
//             <GitHubButton />
//           </div>
//         </div>

//         {/* <AppSearch /> */}
    

//         <div className="text-xs text-gray-500 dark:text-gray-300 tracking-wide pt-16 flex flex-col text-center items-center">
//           <p className=" flex items-baseline font-medium">
//             Made with <HeartHandshake size='12' className="mx-1"/> and
//           </p>
//         <div className="flex gap-2 font-light py-1">
//           shadcn-ui | radix-ui | cmdk | fuse.js | tailwindcss
//         </div>
//           <p className=" flex items-baseline font-medium">
//             by pratiqdev
//           </p>
//         </div>
//       </section>


//       <section className="hidden h-0 sm:flex sm:h-auto w-full flex-col gap-24 items-center  justify-between sm:pt-0 overflow-hidden">
//       <CodeBlock code={`
// import zrch, { usezrch } from 'zrch'

// <zrch 

//   // provide any searchable data, consistency recommended
//   searchable={[ ... ]}

//   // easily handle click and keyboard events
//   onSelect={(result, index) => console.log('Selected item:', result) }

//   // render your own items
//   RenderItem={(result, index) => <p>{result.title}</p>

// />
//       `} />
//       <div className="w-min">
//         <UserButton />
//       </div>

//       </section>