export default function FaqItem({faq, i}) {
    return (
        <div
            className="card border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="card-body">
                <h3 className="card-title text-xl flex items-center text-secondary">
                    <div
                        className="mr-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="font-bold">{i + 1}</span>
                    </div>
                    {faq.question}
                </h3>
                <p className="text-base-content/70 pl-11 text-secondary">{faq.answer}</p>
            </div>
        </div>
    )
}
