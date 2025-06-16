export default function Pricing({price}) {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute -top-40 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="container relative mx-auto">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mb-4">PRICING OPTIONS</span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id={"pricing"}>A little price for a lot of features</h2>
                    <p className="mt-4 text-lg text-base-content/70">Choose the perfect plan for your training needs</p>
                </div>

                <div className="mx-auto max-w-md">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <span className="badge badge-warning self-end">Most Popular</span>
                            <div className="flex justify-between">
                                <h2 className="text-3xl font-bold">Premium</h2>
                                <span className="text-xl">{price}/mo</span>
                            </div>
                            <ul className="mt-6 flex flex-col gap-2 text-xs">
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>Access to the application</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>Dashboard, graphs, record, challenges</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>Filter, activity details</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>Heatmap, comment by AI</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>AI prediction</span>
                                </li>
                            </ul>
                            <div className="mt-6">
                                <button className="btn btn-primary btn-block">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
