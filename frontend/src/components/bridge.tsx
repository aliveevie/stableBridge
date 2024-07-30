import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { JSX, SVGProps } from "react"


export function Bridge() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#0F172A] px-4 py-12 md:px-6 lg:py-24">
      <div className="mx-auto w-full max-w-4xl rounded-lg border border-input bg-background p-6 shadow-lg md:p-8 lg:p-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
            Stacks Bridge
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <BitcoinIcon className="h-5 w-5 text-primary-foreground" />
                  <span className="font-medium text-primary-foreground">BTC 0.0025</span>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-primary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="font-medium">Bridged Assets</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <BitcoinIcon className="h-5 w-5 text-primary-foreground" />
                  <span className="font-medium text-primary-foreground">BTC 0.0025</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <EclipseIcon className="h-5 w-5 text-primary-foreground" />
                  <span className="font-medium text-primary-foreground">ETH 0.0125</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <BitcoinIcon className="h-5 w-5 text-primary-foreground" />
                  <span className="font-medium text-primary-foreground">LTC 0.125</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="w-full max-w-[200px] bg-primary text-primary-foreground hover:bg-primary/90">
            Connect Wallet
          </Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 rounded-lg border border-input bg-background p-6 shadow-lg">
          <BitcoinIcon className="h-10 w-10 text-primary" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary-foreground">Bitcoin</h3>
            <p className="text-muted-foreground">BTC 0.0025</p>
          </div>
          <Button variant="outline" className="w-full">
            View
          </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-4 rounded-lg border border-input bg-background p-6 shadow-lg">
          <EclipseIcon className="h-10 w-10 text-primary" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary-foreground">Ethereum</h3>
            <p className="text-muted-foreground">ETH 0.0125</p>
          </div>
          <Button variant="outline" className="w-full">
            View
          </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-4 rounded-lg border border-input bg-background p-6 shadow-lg">
          <BitcoinIcon className="h-10 w-10 text-primary" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary-foreground">Litecoin</h3>
            <p className="text-muted-foreground">LTC 0.125</p>
          </div>
          <Button variant="outline" className="w-full">
            View
          </Button>
        </Card>
      </div>
    </div>
  )
}

function BitcoinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  )
}


function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function EclipseIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a7 7 0 1 0 10 10" />
    </svg>
  )
}


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
