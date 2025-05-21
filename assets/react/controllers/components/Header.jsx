import {useEffect, useState} from "react";

export default function Header({isLoggedIn}) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <header
            className={`navbar ${scrolled ? 'bg-base-100/90 backdrop-blur-md' : 'bg-transparent'} sticky top-0 z-50 transition-all duration-300`}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <a href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                        <img src="/img/icon.png" alt="Strava" className="h-10 w-10 drop-shadow-md"/>
                        <span
                            className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">StravInsight</span>
                    </a>
                </div>

                <div className="lg:block">
                    <ul className="menu menu-horizontal px-1 flex items-center hidden lg:flex">
                        {["features", "testimonials", "faq"].map(item => (
                            <li key={item}>
                                <a href={`#${item}`}
                                   className="hover:text-primary font-medium transition-all hover:scale-105">
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <a className="btn btn-primary hover:scale-105 transition-all shadow-lg hover:shadow-primary/30"
                       href="/connect/strava">
                        {isLoggedIn ? "Dashboard" : "Login with Strava"}
                    </a>
                </div>
            </div>
        </header>
    )
}
