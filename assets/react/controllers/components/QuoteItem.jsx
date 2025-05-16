import {Star} from "lucide-react";

export default function QuoteItem({testimonial, i}) {
    return (
        <div key={i}
             className="card h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white backdrop-blur-lg">
            <div className="card-body">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div
                            className="w-14 h-14 rounded-full ring-2 ring-primary/20 ring-offset-2">
                            <img src={testimonial.avatar || "/img/person/3.jpeg"}
                                 alt={testimonial.name}/>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-secondary">{testimonial.name}</h3>
                        <p className="text-sm opacity-70 text-secondary">{testimonial.title}</p>
                    </div>
                </div>
                <div className="flex h-full flex-col">
                    <div className="mb-4 flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i}
                                  className="h-5 w-5 fill-primary text-primary drop-shadow-sm"/>
                        ))}
                    </div>
                    <p className="flex-1 italic text-base-content/70 border-l-4 border-primary/20 pl-4 text-secondary">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
            </div>
        </div>
    )
}
