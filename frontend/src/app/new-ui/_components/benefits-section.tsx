import { Shield, Workflow, Coins } from "lucide-react"

export function BenefitsSection() {
  return (
    <section className="relative py-24 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-gray-800">
            Why Bridge with Stacks?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Experience the best of both worlds with our secure, efficient, and user-friendly bridge solution.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl border border-gray-100">
            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-800">Unmatched Security</h3>
            <p className="text-gray-600">
              Our bridge leverages the security of both Ethereum and Bitcoin, with multi-signature validation and
              regular security audits to ensure your assets remain safe.
            </p>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl border border-gray-100">
            <div className="mb-4 inline-flex rounded-lg bg-pink-100 p-3">
              <Workflow className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-800">True Decentralization</h3>
            <p className="text-gray-600">
              Built on Stacks technology, our bridge maintains the decentralized ethos of blockchain while providing
              seamless interoperability between networks.
            </p>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl border border-gray-100">
            <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3">
              <Coins className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-800">New Opportunities</h3>
            <p className="text-gray-600">
              Access the best of both ecosystems - Ethereum's rich DeFi landscape and Bitcoin's unparalleled store of
              value, all through one seamless interface.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}