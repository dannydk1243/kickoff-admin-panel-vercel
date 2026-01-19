import Image from "next/image"

import { Button } from "@/components/ui/button"

export function LinkExpired() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-6 text-center text-foreground bg-background p-4">
      <div className="flex flex-col-reverse justify-center items-center gap-y-6 md:flex-row md:text-start">
        <Image
          src="/images/illustrations/characters/character-03.svg"
          alt=""
          height={242}
          width={171}
          priority
        />
        <h1 className="inline-grid text-3xl font-black">
          Link Expired !!!
          {/* <span className="text-xl font-semibold">
            We&apos;ll be back soon!
          </span> */}
        </h1>
      </div>
      <p className="max-w-prose text-xl text-muted-foreground">
        Contact Admin for new link. Thank you for your patience!
      </p>
      {/* <Button size="lg">Refresh Page</Button> */}
    </div>
  )
}
