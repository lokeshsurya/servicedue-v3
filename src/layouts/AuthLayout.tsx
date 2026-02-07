import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'

function AuthLayout() {
  useEffect(() => {
    document.body.classList.add('auth-mode')
    return () => {
      document.body.classList.remove('auth-mode')
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white antialiased">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-12 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-12">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/5 p-2 shadow-sm">
                <img src="/logo-full.png" alt="ServiceDue" className="h-8 w-auto object-contain" />
              </div>
              <div className="text-sm text-white/60">
                Revenue Intelligence OS for Suzuki Dealers
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Turn routine service data into live, recoverable revenue.
              </h1>
              <p className="text-base text-white/70 lg:text-lg">
                Built for Suzuki two-wheeler dealers. Segment customers, launch campaigns, and watch
                recovery metrics update in real time.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['< 2s', 'Process DMS exports instantly'],
                  ['₹ Live', 'Track recovered revenue ticker'],
                  ['Autopilot', 'WhatsApp + Voice executed for you'],
                  ['CFO View', 'Risk, urgent, pipeline metrics'],
                ].map(([title, subtitle]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="text-sm text-white/60">{subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Trusted by 20+ dealers in Maharashtra</span>
              <Link to="/landing" className="text-white/80 hover:text-white transition">
                Back to landing
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/95 px-8 py-10 text-slate-900 shadow-2xl shadow-black/20 sm:px-12 sm:py-12 backdrop-blur-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
