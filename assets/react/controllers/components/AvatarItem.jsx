export default function AvatarItem({i}) {
    return (
        <div className="avatar">
            <div className="w-12 h-12 border-2 border-white rounded-full">
                <img src={`/img/person/${i + 1}.jpeg?height=80&width=80&text=${i + 1}`}
                     alt={`User ${i + 1}`}/>
            </div>
        </div>
    )
}
