import {ArrowRight} from "lucide-react";

export default function PremiumBanner() {
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-orange-100/30 to-base-100 py-24 md:py-36 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full">
                <div
                    className="absolute opacity-20 -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary to-orange-300 rounded-full blur-3xl"></div>
                <div
                    className="absolute opacity-10 top-60 -left-20 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container relative flex flex-col items-center text-center mx-auto">
                        <span
                            className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-semibold mb-8 shadow-sm animate-pulse">Optimize Your Training</span>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Elevate Your <span className="text-primary drop-shadow-lg relative">
                                Training
                                <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/30 rounded-full"></span>
                            </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-base-content/90 md:text-xl font-medium leading-relaxed">
                    Advanced analytics and insights for serious athletes. Transform your Strava data into
                    actionable training intelligence.
                </p>
                <div className="mt-8 w-48 animate-bounce">
                    <img alt={"Logo"} src={"img/strava.png"} className="drop-shadow-xl"/>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                        className="btn btn-primary btn-lg shadow-xl hover:shadow-primary/50 transform hover:-translate-y-1 transition-all"
                        onClick={() => {
                            document.location.href = "/connect/strava"
                        }}>
                        Get Started For Free
                        <ArrowRight className="h-5 w-5 ml-1 animate-pulse"/>
                    </button>
                    <button
                        className="btn glass btn-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transform hover:-translate-y-1 transition-all"
                        onClick={() => window.open("https://www.youtube.com/watch?v=4iChsZTyk-c", "_blank")}>
                        View Demo
                    </button>
                </div>
                <iframe
                    className="mt-16 w-full max-w-5xl aspect-[16/9] rounded-2xl"
                    src="https://www.youtube.com/embed/4iChsZTyk-c?start=18&autoplay=0&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&vq=hd1080"
                    title="Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </section>
    )
}
